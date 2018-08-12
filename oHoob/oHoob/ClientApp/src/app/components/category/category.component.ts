import { Component, OnInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { MatPaginator, MatTableDataSource, MatSort, MatSnackBar } from '@angular/material';
//import { CategoryService } from '../../services/app-services/category.service';
import { AccountService } from '../../services/account.service';
import { CategoryService } from '../../services/app-services/category.service';
import { Category } from '../../models/category.model';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';

export interface PeriodicElement {
  name: string;
  id: number;
  description: number;
  order: string;

}

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  animations: [fadeInOut],
})

export class CategoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['name', 'description', 'order', 'active', 'action'];
  dataSource: MatTableDataSource<Category>;
  loadingIndicator: boolean;

  constructor(private categoryService: CategoryService, private snackBar: MatSnackBar, private alertService: AlertService) {    
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

}
