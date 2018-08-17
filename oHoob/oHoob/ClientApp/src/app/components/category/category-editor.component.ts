import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { AccountService } from '../../services/account.service';
import { EqualValidator } from '../../directives/equal-validator.directive';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/app-services/category.service';

@Component({
  selector: 'app-category-editor',
  templateUrl: './category-editor.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryEditorComponent implements OnInit {
  
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

  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private catService: CategoryService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CategoryEditorComponent>, @Inject(MAT_DIALOG_DATA) public data: Category 
  ) {
    if (data.id) {
      this.item = data;
      this.isNewItem = false;
      this.buildEditForm(data)
    }
    else {
      this.buildForm();
    }
    
  }

  ngOnInit() {
  }

  private buildForm() {
    this.itemForm = this.formBuilder.group({
     
      name: ['', Validators.required],      
      description: '',
      order: 0,
      isActive: ''
    });    
  }

  private buildEditForm(cat: Category) {
    this.itemForm = this.formBuilder.group({

      name: [cat.name, Validators.required],
      description: cat.description,
      order: cat.order,
      isActive: cat.isActive
    });
  }

  public save() {
    
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
      appName: 'News',
      userId: '',
      categoryParent: 0
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
}
