import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, forkJoin } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { AppEndpoint } from './app-endpoint.service';
import { Role } from '../../models/role.model';
import { AuthService } from '../auth.service';
import { Category } from '../../models/category.model';



export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class CategoryService {
  public static readonly roleAddedOperation: RolesChangedOperation = "add";
  public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
  public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

  private _rolesChanged = new Subject<RolesChangedEventArg>();

  constructor(private router: Router, private http: HttpClient, private authService: AuthService,
    private appEndpoint: AppEndpoint) {
    appEndpoint._controller = "/api/Categories";
    appEndpoint._controllerUrl = "";
    appEndpoint._controllerNameUrl = "/name";    
  }

  getItem(itemId?: string) {
    return this.appEndpoint.getItemEndpoint<Category>(itemId);
  }

 
  getItems(page?: number, pageSize?: number) {

    return this.appEndpoint.getItemsEndpoint<Category[]>(page, pageSize);
  }


  updateUser(cat: Category) {
    if (cat.id) {
      return this.appEndpoint.getUpdateItemEndpoint(cat, cat.id);
    }
    else {
      return this.appEndpoint.getItemByUserNameEndpoint<Category>(cat.name).pipe<Category>(
        mergeMap(foundUser => {
          cat.id = foundUser.id;
          return this.appEndpoint.getUpdateItemEndpoint(cat, cat.id)
        }));
    }
  }


  newUser(user: Category) {
    
    return this.appEndpoint.getNewItemEndpoint<Category>(user);
  }


}
