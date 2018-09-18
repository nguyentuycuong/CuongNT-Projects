// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { EndpointFactory } from '../endpoint-factory.service';
import { ConfigurationService } from '../configuration.service';


@Injectable()
export class ProductServiceEndpoint extends EndpointFactory {

  public _controller: string;
  public _controllerUrl: string;
  public _controllerNameUrl: string;
  public _currentItemUrl: string;
  public _currentItemPreferencesUrl;
  public _unblockItemUrl: string;
  public _rolesUrl: string;
  public _roleByRoleNameUrl: string;
  public _permissionsUrl: string;

  get controllerUrl() { return this.configurations.baseUrl + this._controller + this._controllerUrl; }
  get controllerNameUrl() { return this.configurations.baseUrl + this._controller + this._controllerNameUrl; }

  get currentItemUrl() { return this.configurations.baseUrl + this._controller + this._currentItemUrl; }
  get currentItemPreferencesUrl() { return this.configurations.baseUrl + this._controller + this._currentItemPreferencesUrl; }
  get unblockItemUrl() { return this.configurations.baseUrl + this._controller + this._unblockItemUrl; }
  get rolesUrl() { return this.configurations.baseUrl + this._controller + this._rolesUrl; }
  get roleByRoleNameUrl() { return this.configurations.baseUrl + this._controller + this._roleByRoleNameUrl; }
  get permissionsUrl() { return this.configurations.baseUrl + this._controller + this._permissionsUrl; }



  constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
    
    super(http, configurations, injector);
  }




  getItemEndpoint<T>(itemId?: string): Observable<T> {
    let endpointUrl = itemId ? `${this.controllerUrl}/${itemId}` : this.currentItemUrl;

    return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getItemEndpoint(itemId));
      }));
  }


  getItemByNameEndpoint<T>(name: string): Observable<T> {
    let endpointUrl = `${this.controllerNameUrl}/${name}`;

    return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getItemByNameEndpoint(name));
      }));
  }


  getItemsEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
    let endpointUrl = page && pageSize ? `${this.controllerUrl}/${page}/${pageSize}` : this.controllerUrl;
    //alert(endpointUrl)
    return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getItemsEndpoint(page, pageSize));
      }));
  }


  getNewItemEndpoint<T>(itemObject: any): Observable<T> {

    return this.http.post<T>(this.controllerUrl, JSON.stringify(itemObject), this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getNewItemEndpoint(itemObject));
      }));
  }

  getUpdateItemEndpoint<T>(itemObject: any, itemId?: string): Observable<T> {
    let endpointUrl = itemId ? `${this.controllerUrl}/${itemId}` : this.currentItemUrl;

    return this.http.put<T>(endpointUrl, JSON.stringify(itemObject), this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUpdateItemEndpoint(itemObject, itemId));
      }));
  }

  getPatchUpdateItemEndpoint<T>(patch: {}, itemId?: string): Observable<T>
  getPatchUpdateItemEndpoint<T>(value: any, op: string, path: string, from?: any, itemId?: string): Observable<T>
  getPatchUpdateItemEndpoint<T>(valueOrPatch: any, opOrItemId?: string, path?: string, from?: any, itemId?: string): Observable<T> {
    let endpointUrl: string;
    let patchDocument: {};

    if (path) {
      endpointUrl = itemId ? `${this.controllerUrl}/${itemId}` : this.currentItemUrl;
      patchDocument = from ?
        [{ "value": valueOrPatch, "path": path, "op": opOrItemId, "from": from }] :
        [{ "value": valueOrPatch, "path": path, "op": opOrItemId }];
    }
    else {
      endpointUrl = opOrItemId ? `${this.controllerUrl}/${opOrItemId}` : this.currentItemUrl;
      patchDocument = valueOrPatch;
    }

    return this.http.patch<T>(endpointUrl, JSON.stringify(patchDocument), this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getPatchUpdateItemEndpoint(valueOrPatch, opOrItemId, path, from, itemId));
      }));
  }

  getDeleteItemEndpoint<T>(itemId: string): Observable<T> {
    let endpointUrl = `${this.controllerUrl}/${itemId}`;

    return this.http.delete<T>(endpointUrl, this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getDeleteItemEndpoint(itemId));
      }));
  }
  
 
  getRolesEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
    let endpointUrl = page && pageSize ? `${this.rolesUrl}/${page}/${pageSize}` : this.rolesUrl;

    return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getRolesEndpoint(page, pageSize));
      }));
  }

  getNewRoleEndpoint<T>(roleObject: any): Observable<T> {

    return this.http.post<T>(this.rolesUrl, JSON.stringify(roleObject), this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getNewRoleEndpoint(roleObject));
      }));
  }

  getUpdateRoleEndpoint<T>(roleObject: any, roleId: string): Observable<T> {
    let endpointUrl = `${this.rolesUrl}/${roleId}`;

    return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUpdateRoleEndpoint(roleObject, roleId));
      }));
  }

  getDeleteRoleEndpoint<T>(roleId: string): Observable<T> {
    let endpointUrl = `${this.rolesUrl}/${roleId}`;

    return this.http.delete<T>(endpointUrl, this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getDeleteRoleEndpoint(roleId));
      }));
  }


  getPermissionsEndpoint<T>(): Observable<T> {

    return this.http.get<T>(this.permissionsUrl, this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getPermissionsEndpoint());
      }));
  }
}
