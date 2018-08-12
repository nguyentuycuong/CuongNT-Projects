import { Component, OnInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { MatPaginator, MatTableDataSource, MatSort, MatSnackBar } from '@angular/material';
//import { CategoryService } from '../../services/app-services/category.service';
import { AccountService } from '../../services/account.service';
import { CategoryService } from '../../services/app-services/category.service';
import { Category } from '../../models/category.model';

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

  //data: Category[] = [];

  displayedColumns: string[] = ['name', 'description', 'order', 'active', 'action'];
  dataSource: MatTableDataSource<Category>;

  loadingIndicator: boolean;



  constructor(private categoryService: CategoryService, private snackBar: MatSnackBar) {
    //this.categoryService.getItems().subscribe(result => this.suc(result));
    // setTimeout(this.dataSource = new MatTableDataSource(this.data1), 1000)

    this.dataSource = new MatTableDataSource();

  }

  suc(d: Category[]) {
    this.loadingIndicator = false;
    this.dataSource.data = d;
    //this.dataSource = new MatTableDataSource(d);
  }

  ngOnInit() {
    this.loadData();

    //this.dataSource.paginator = this.paginator;
    //this.categoryService.getItems().subscribe(result => this.data = result);
    //this.dataSource = new MatTableDataSource(this.data1);
    //setTimeout(function () {
    //  this.dataSource = new MatTableDataSource(this.data);
    //}, 1000);
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

    this.categoryService.getItems().subscribe(result => this.suc(result));
  }

}
