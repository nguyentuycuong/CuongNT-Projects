import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, forkJoin } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { Role } from '../../models/role.model';
import { AuthService } from '../auth.service';
import { Product } from '../../models/product.model';
import { ProductServiceEndpoint } from './product.endpoint.service';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class ProductService {
  public static readonly roleAddedOperation: RolesChangedOperation = "add";
  public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
  public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

  private _rolesChanged = new Subject<RolesChangedEventArg>();

  constructor(private router: Router, private http: HttpClient, private authService: AuthService,
    private appEndpoint: ProductServiceEndpoint) {
    appEndpoint._controller = "/api/Product";
    appEndpoint._controllerUrl = "";
    appEndpoint._controllerNameUrl = "/name";
  }

  getItem(itemId?: string) {
    return this.appEndpoint.getItemEndpoint<Product>(itemId);
  }

  getItems(page?: number, pageSize?: number) {
    return this.appEndpoint.getItemsEndpoint<Product[]>(page, pageSize);
  }

  updateItem(cat: Product) {
    if (cat.id) {
      return this.appEndpoint.getUpdateItemEndpoint(cat, cat.id);
    }
    else {
      return this.appEndpoint.getItemByNameEndpoint<Product>(cat.name).pipe<Product>(
        mergeMap(foundItem => {
          cat.id = foundItem.id;
          return this.appEndpoint.getUpdateItemEndpoint(cat, cat.id)
        }));
    }
  }

  newItem(product: Product) {
    return this.appEndpoint.getNewItemEndpoint<Product>(product);
  }

  deleteItem(productId: string): Observable<Product> {
    return this.appEndpoint.getDeleteItemEndpoint<Product>(<string>productId);
  }
}
