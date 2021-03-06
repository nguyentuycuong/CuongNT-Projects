import { Component, OnInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { MatPaginator, MatTableDataSource, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { AccountService } from '../../services/account.service';
import { Category } from '../../models/category.model';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { ProductsCategoryEditorComponent } from './products-category-editor.component';
import { ProductsCategoryService } from '../../services/app/productsCategory.service';
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

export interface PeriodicElement {
  name: string;
  id: number;
  description: number;
  order: string;

}

@Component({
  selector: 'app-products-category',
  templateUrl: './products-category.component.html',
  styleUrls: ['./products.component.css'],
  animations: [fadeInOut],
})

export class ProductsCategoryComponent implements OnInit {
    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches)
      );

  loadingIndicator: boolean;
  sourceCategory: Category;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['name', 'description', 'order', 'active', 'image', 'action'];
  dataSource: MatTableDataSource<Category>;
  

  constructor(private breakpointObserver: BreakpointObserver, private categoryService: ProductsCategoryService, private snackBar: MatSnackBar, private alertService: AlertService, private dialog: MatDialog) {    
    this.dataSource = new MatTableDataSource();
    
  }
  

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }

  private refresh() {
    // Causes the filter to refresh there by updating with recently added data.
    this.applyFilter(this.dataSource.filter);
  }

  private loadData() {

    this.loadingIndicator = true;

    this.categoryService.getItems().subscribe(result => this.onDataLoadSuccessful(result), error => this.onDataLoadFailed(error));
  }

  onDataLoadSuccessful(d: Category[]) {
    this.loadingIndicator = false;
    this.dataSource.data = d;
  }

  private onDataLoadFailed(error: any) {
    
    this.loadingIndicator = false;

    this.alertService.showStickyMessage("Load Error",
      `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
      MessageSeverity.error,
      error);
  }

  private updateItems(cat: Category) {
    if (this.sourceCategory) {
      
      Object.assign(this.sourceCategory, cat);
      this.alertService.showMessage("Success",
        `Changes to item \"${cat.name}\" was saved successfully`,
        MessageSeverity.success);
      this.sourceCategory = null;
    } else {
      
      this.dataSource.data.push(cat);
      this.refresh();
      this.alertService.showMessage("Success",
        `Item \"${cat.name}\" was created successfully`,
        MessageSeverity.success);
    }
  }

  private editItemClick(cat?: Category) {
    this.sourceCategory = cat;
    
    let dialogRef = this.dialog.open(ProductsCategoryEditorComponent,
      {
        panelClass: 'mat-dialog-lg',
        data: (cat) ? cat : new Category,
        disableClose: true,
        ariaLabel: "System dialog"
      });
    dialogRef.afterClosed().subscribe(cat => {
      if (cat) {
        this.updateItems(cat);
      }
    });
  }

  private confirmDelete(currentItem: Category) {
    this.snackBar.open(`Delete ${currentItem.name}?`, 'DELETE', { duration: 5000 })
      .onAction().subscribe(() => {
        this.alertService.startLoadingMessage("Deleting...");
        this.loadingIndicator = true;

        this.categoryService.deleteUser(currentItem.id)
          .subscribe(results => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.dataSource.data = this.dataSource.data.filter(item => item !== currentItem)
          },
          error => {
            
              this.alertService.stopLoadingMessage();
              this.loadingIndicator = false;

              this.alertService.showStickyMessage("Delete Error",
                `An error occured whilst deleting the user.\r\nError: "${Utilities
                  .getHttpResponseMessage(error)}"`,
                MessageSeverity.error,
                error);
            })
      });
  }
}
