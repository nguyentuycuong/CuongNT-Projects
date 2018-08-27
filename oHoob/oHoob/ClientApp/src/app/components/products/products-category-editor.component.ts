import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Subscription, Subject, Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { AccountService } from '../../services/account.service';
import { EqualValidator } from '../../directives/equal-validator.directive';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Category } from '../../models/category.model';
import { AuthService } from '../../services/auth.service';
import { ProductsCategoryService } from '../../services/app-services/productsCategory.service';
import { HttpRequest, HttpClient, HttpEventType } from '@angular/common/http';
//import { RequestOptions } from '@angular/http';
import { Event } from '@angular/router';
import { error } from 'protractor';

@Component({
  selector: 'app-products-category-editor',
  templateUrl: './products-category-editor.component.html',
  styleUrls: ['./products-category.component.css']
})
export class ProductsCategoryEditorComponent implements OnInit {
  progress: number;
  content: CanvasRenderingContext2D;
  @ViewChild("myCanvas") mycanvas;

  @ViewChild('form')
  private form: NgForm;

  isNewItem = true;
  private onUserSaved = new Subject<Category>();

  @Input()
  item: Category = new Category();
  @Input()
  isEditMode: boolean = false;

  itemForm: FormGroup;
  userSaved$ = this.onUserSaved.asObservable();

  private isSaving = false;
  fileName: string;
  folder: string = "Icons";

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private catService: ProductsCategoryService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProductsCategoryEditorComponent>, @Inject(MAT_DIALOG_DATA) public data: Category
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

  ngOnInit() {
    this.getImage(this.item.icon);
  }

  private buildForm() {
    this.itemForm = this.formBuilder.group({

      name: ['', Validators.required],
      description: '',
      order: 0,
      isActive: '',
      icon: ''
    });
  }

  private buildEditForm(cat: Category) {
    this.itemForm = this.formBuilder.group({

      name: [cat.name, Validators.required],
      description: cat.description,
      order: cat.order,
      isActive: cat.isActive,
      icon: cat.icon
    });
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
    this.upload(files);
    //alert(this.isNewItem)
    if (this.isNewItem) {

      this.catService.newUser(editedUser).subscribe(
        user => this.saveCompleted(user),
        error => this.saveFailed(error));
    } else {

      this.catService.updateUser(editedUser).subscribe(
        response => this.saveCompleted(editedUser),
        error => this.saveFailed(error));
    }
  }

  private getEditedItem(): Category {
    const formModel = this.itemForm.value;

    return {
      id: this.item.id,
      name: formModel.name,
      description: formModel.description,
      order: formModel.order,
      isActive: (formModel.isActive) ? formModel.isActive : false,
      appName: 'Product',
      userId: this.authService.currentUser.id,
      categoryParent: 0,
      icon: (this.fileName) ? this.folder + "/" + this.fileName : this.item.icon,
    };
  }
  private saveCompleted(cat?: Category) {
    if (cat) {
      this.item = cat;
    }

    this.isSaving = false;
    this.alertService.stopLoadingMessage();

    //this.resetForm(true);

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

  private getImage(urlImage) {
    if (urlImage) {
      let canvas = this.mycanvas.nativeElement;
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
   // alert(1);
    var render = new FileReader();
    render.onload = function (event) {
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
    
    this.http.request(uploadReq).subscribe(event => this.uploadSuccess(event), error => this.uploadFaile(error));
  }

  private uploadSuccess(result) {
    //alert("Upload success " + result[0]);
  }

  private uploadFaile(result) {
    this.alertService.showMessage("Upload fail " + result);
  }
  
}
