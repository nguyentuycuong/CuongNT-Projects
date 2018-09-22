import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../../services/auth.service';

import { HttpRequest, HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
//import { RequestOptions } from '@angular/http';

import { Product } from '../../models/product.model';
import { ProductService } from '../../services/app/product.service';
//import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';

const URL = '/api/upload/product';

@Component({
  selector: 'app-products-editor',
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductEditorComponent implements OnInit {


  progress: number;
  content: CanvasRenderingContext2D;
  @ViewChild("myCanvas") mycanvas;
  ckeConfig: any;
  @ViewChild('form')
  private form: NgForm;

  isNewItem = true;
  private onUserSaved = new Subject<Product>();

  @Input()
  item: Product = new Product();
  @Input()
  isEditMode: boolean = false;

  itemForm: FormGroup;
  userSaved$ = this.onUserSaved.asObservable();

  private isSaving = false;
  fileName: string;
  folder: string = "Icons";

  public Editor = ClassicEditor;
  
  public uploader: FileUploader = new FileUploader({ url: URL });
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProductEditorComponent>, @Inject(MAT_DIALOG_DATA) public data: Product
  ) {
    if (data.id) {
      this.item = data;
      this.isNewItem = false;
      this.buildEditForm(data);

    }
    else {
      this.buildForm();
    }
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  ngOnInit() {
    
    this.getImage(this.item.icon, this.mycanvas);

    this.ckeConfig = {
      toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
      heading: {
        options: [
          { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
          { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
          { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        ],
      },

    };
  }

  private buildForm() {
    this.itemForm = this.formBuilder.group({
      productCode: ['', Validators.required],
      name: ['', Validators.required],
      description: '',
      isActive: true,
      productCategoryId: 0,
      icon: '',
      buyingPrice: '',
      sellingPrice: '',
      oldPrice: '',
      unitsInStock: 1,
      isDiscontinued: false,
      isPromote: false,
      isHot: false,
      gallery: '',
      content: '',
      releaseDate: null,
    });
  }

  private buildEditForm(product: Product) {
    this.itemForm = this.formBuilder.group({
      productCode: [product.productCode, Validators.required],
      name: [product.name, Validators.required],
      description: product.description,
      isActive: product.isActive,
      productCategoryId: product.productCategoryId,
      icon: product.icon,
      buyingPrice: product.buyingPrice,
      sellingPrice: product.sellingPrice,
      oldPrice: product.oldPrice,
      unitsInStock: product.unitsInStock,
      isDiscontinued: product.isDiscontinued,
      isPromote: product.isPromote,
      isHot: product.isHot,
      gallery: product.gallery,
      content: product.content,
      releaseDate: product.releaseDate,
    });

    this.getImageLibrary(product.gallery);
  }

  private getEditedItem(): Product {
    const formModel = this.itemForm.value;
    return {
      id: this.item.id,
      name: formModel.name,
      description: formModel.description,
      isActive: (formModel.isActive) ? formModel.isActive : false,
      productCategoryId: 0,
      icon: (this.fileName) ? this.folder + "/" + this.fileName : this.item.icon,
      buyingPrice: formModel.buyingPrice,
      sellingPrice: formModel.sellingPrice,
      oldPrice: formModel.oldPrice,
      unitsInStock: 1,
      isDiscontinued: (formModel.isDiscontinued) ? formModel.isDiscontinued : false,
      isPromote: (formModel.isPromote) ? formModel.isPromote : false,
      isHot: (formModel.isHot) ? formModel.isHot : false,
      gallery: this.getGallery(),
      productCode: formModel.productCode,
      content: formModel.content,
      releaseDate: formModel.releaseDate,
    };
  }

  public save(files) {

    //alert(files.lenght);
    if (!this.form.submitted) {
      // Causes validation to update.
      this.form.onSubmit(null);
      return;
    }

    if (!this.itemForm.valid) {
      this.alertService.showStickyMessage('Error');
      return;
    }

    this.isSaving = true;
    this.alertService.startLoadingMessage("Saving changes...");

    const editedUser = this.getEditedItem();
    
    //alert(this.isNewItem)
    if (this.isNewItem) {

      this.productService.newItem(editedUser).subscribe(
        user => this.saveCompleted(user),
        error => this.saveFailed(error));
    } else {

      this.productService.updateItem(editedUser).subscribe(
        response => this.saveCompleted(editedUser),
        error => this.saveFailed(error));
    }

    this.upload(files);
  }

  private saveCompleted(cat?: Product) {
    if (cat) {
      this.item = cat;
    }

    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    this.uploader.uploadAll();
    this.onUserSaved.next(this.item);

    this.dialogRef.close(cat);
  }

  private saveFailed(error: any) {
    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage("Save Error",
      "One or more errors occured whilst saving your changes:",
      MessageSeverity.error,
      error);
    this.alertService.showStickyMessage(error, null, MessageSeverity.error);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  private getImage(urlImage, controlCanvas: any) {
    if (urlImage) {
      let canvas = controlCanvas.nativeElement;
      let context = canvas.getContext("2d");
      context.clearRect(0, 0, 200, 200);

      var image = new Image();
      image.src = urlImage;
      image.onload = function () {
        canvas.width = image.width > 300 ? 300 : image.width;
        canvas.height = image.height > 300 ? 300 : image.height;
        context.drawImage(image, 0, 0);
      }
    }
  }

  private preview(e): void {

    let canvas = this.mycanvas.nativeElement;
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, 200, 200);

    var render = new FileReader();
    render.onload = function (event: any) {
      var image = new Image();
      image.onload = function () {
        canvas.width = image.width > 300 ? 300 : image.width;
        canvas.height = image.height > 300 ? 300 : image.height;
        context.drawImage(image, 0, 0);
      }

      image.src = event.target.result;

    };

    if (e.target.files.length > 0) {
      render.readAsDataURL(e.target.files[0])
      this.fileName = e.target.files[0].name;
    }
  }

  private upload(files) {
    if (files.length === 0)
      return;

    const formData = new FormData();

    for (let file of files)
      formData.append(file.name, file);

    const uploadReq = new HttpRequest('POST', '/api/upload/Icons', formData, {
      reportProgress: true,
    });

    this.http.request(uploadReq).subscribe(event => this.uploadSuccess(event), error => {
      //alert(JSON.stringify(error));
    });
  }

  private uploadSuccess(result) {
    //alert("Upload success " + result);
  }

  private uploadFaile(result) {
    this.alertService.showMessage("Upload fail " + result);
  }

  private getGallery() {
    var images = '';
    for (let item of this.uploader.queue) {
      images += item.file.name + ";";
    }
    return images;
  };

  private getImageLibrary(strImage) {    
    var images = strImage.split(';');
    for (let i of images) {
      if (i) {
        this.getFile(i);
      }
    }
  }

  private getFile(name) {    
      this.http.get('/product/' + name, { responseType: 'blob' }).subscribe(response => {
        let blob = new Blob([response], { type: response.type });
        var file = new File([blob], name, { type: response.type, lastModified: Date.now() });
        var fileItem: File[] = [];
        fileItem.push(file);
        this.uploader.addToQueue(fileItem);

        for (let item of this.uploader.queue) {
          item.isSuccess = true;
          item.isReady = true;
        }
      }, error => {
        console.log(error);
      });   
  }
}
