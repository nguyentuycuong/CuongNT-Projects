import { Component, OnInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { MatPaginator, MatTableDataSource, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { AccountService } from '../../services/account.service';
import { Category } from '../../models/category.model';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/app/product.service';
import { ProductEditorComponent } from './products-editor.component';
import { SelectionModel } from '@angular/cdk/collections';
import { PeriodicElement } from '../category/category.component';

@Component({
    selector: 'products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css'],
    animations: [fadeInOut]
})
export class ProductsComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  loadingIndicator: boolean;
  sourceProduct: Product;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['select','name', 'description', 'active', 'image', 'action'];
  dataSource: MatTableDataSource<Product>;
  selection = new SelectionModel<PeriodicElement>(true, []);


  constructor(private breakpointObserver: BreakpointObserver, private productService: ProductService, private snackBar: MatSnackBar, private alertService: AlertService, private dialog: MatDialog) {
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

    this.productService.getItems().subscribe(result => this.onDataLoadSuccessful(result), error => this.onDataLoadFailed(error));
  }

  onDataLoadSuccessful(d: Product[]) {
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

  private updateItems(cat: Product) {
    if (this.sourceProduct) {

      Object.assign(this.sourceProduct, cat);
      this.alertService.showMessage("Success",
        `Changes to item \"${cat.name}\" was saved successfully`,
        MessageSeverity.success);
      this.sourceProduct = null;
    } else {

      this.dataSource.data.push(cat);
      this.refresh();
      this.alertService.showMessage("Success",
        `Item \"${cat.name}\" was created successfully`,
        MessageSeverity.success);
    }
  }

  private editItemClick(product?: Product) {
    this.sourceProduct = product;

    let dialogRef = this.dialog.open(ProductEditorComponent,
      {
        panelClass: 'mat-dialog-lg',
        data: (product) ? product : new Product,
        disableClose: true,
        ariaLabel: "System dialog"
      });
    dialogRef.afterClosed().subscribe(cat => {
      if (cat) {
        this.updateItems(cat);
      }
    });
  }

  private confirmDelete(currentItem: Product) {
    this.snackBar.open(`Delete ${currentItem.name}?`, 'DELETE', { duration: 5000 })
      .onAction().subscribe(() => {
        this.alertService.startLoadingMessage("Deleting...");
        this.loadingIndicator = true;

        this.productService.deleteItem(currentItem.id)
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
