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
export class AppEndpoint extends EndpointFactory {

  public _controller;
  public _controllerUrl: string;
  public _controllerNameUrl: string;
  public _currentUserUrl: string;
  public _currentUserPreferencesUrl;
  public _unblockUserUrl: string;
  public _rolesUrl: string;
  public _roleByRoleNameUrl: string;
  public _permissionsUrl: string;

  get controllerUrl() { return this.configurations.baseUrl + this._controller + this._controllerUrl; }
  get controllerNameUrl() { return this.configurations.baseUrl + this._controller + this._controllerNameUrl; }

  get currentUserUrl() { return this.configurations.baseUrl + this._controller + this._currentUserUrl; }
  get currentUserPreferencesUrl() { return this.configurations.baseUrl + this._controller + this._currentUserPreferencesUrl; }
  get unblockUserUrl() { return this.configurations.baseUrl + this._controller + this._unblockUserUrl; }
  get rolesUrl() { return this.configurations.baseUrl + this._controller + this._rolesUrl; }
  get roleByRoleNameUrl() { return this.configurations.baseUrl + this._controller + this._roleByRoleNameUrl; }
  get permissionsUrl() { return this.configurations.baseUrl + this._controller + this._permissionsUrl; }



  constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

    super(http, configurations, injector);
  }




  getUserEndpoint<T>(itemId?: string): Observable<T> {
    let endpointUrl = itemId ? `${this.controllerUrl}/${itemId}` : this.currentUserUrl;

    return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUserEndpoint(itemId));
      }));
  }


  getUserByUserNameEndpoint<T>(name: string): Observable<T> {
    let endpointUrl = `${this.controllerNameUrl}/${name}`;

    return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUserByUserNameEndpoint(name));
      }));
  }


  getUsersEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
    let endpointUrl = page && pageSize ? `${this.controllerUrl}/${page}/${pageSize}` : this.controllerUrl;

    return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUsersEndpoint(page, pageSize));
      }));
  }


  getNewUserEndpoint<T>(userObject: any): Observable<T> {

    return this.http.post<T>(this.controllerUrl, JSON.stringify(userObject), this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getNewUserEndpoint(userObject));
      }));
  }

  getUpdateUserEndpoint<T>(itemObject: any, itemId?: string): Observable<T> {
    let endpointUrl = itemId ? `${this.controllerUrl}/${itemId}` : this.currentUserUrl;

    return this.http.put<T>(endpointUrl, JSON.stringify(itemObject), this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUpdateUserEndpoint(itemObject, itemId));
      }));
  }

  getPatchUpdateUserEndpoint<T>(patch: {}, userId?: string): Observable<T>
  getPatchUpdateUserEndpoint<T>(value: any, op: string, path: string, from?: any, itemId?: string): Observable<T>
  getPatchUpdateUserEndpoint<T>(valueOrPatch: any, opOrUserId?: string, path?: string, from?: any, itemId?: string): Observable<T> {
    let endpointUrl: string;
    let patchDocument: {};

    if (path) {
      endpointUrl = itemId ? `${this.controllerUrl}/${itemId}` : this.currentUserUrl;
      patchDocument = from ?
        [{ "value": valueOrPatch, "path": path, "op": opOrUserId, "from": from }] :
        [{ "value": valueOrPatch, "path": path, "op": opOrUserId }];
    }
    else {
      endpointUrl = opOrUserId ? `${this.controllerUrl}/${opOrUserId}` : this.currentUserUrl;
      patchDocument = valueOrPatch;
    }

    return this.http.patch<T>(endpointUrl, JSON.stringify(patchDocument), this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getPatchUpdateUserEndpoint(valueOrPatch, opOrUserId, path, from, itemId));
      }));
  }


  getUserPreferencesEndpoint<T>(): Observable<T> {

    return this.http.get<T>(this.currentUserPreferencesUrl, this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUserPreferencesEndpoint());
      }));
  }

  getUpdateUserPreferencesEndpoint<T>(configuration: string): Observable<T> {
    return this.http.put<T>(this.currentUserPreferencesUrl, JSON.stringify(configuration), this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUpdateUserPreferencesEndpoint(configuration));
      }));
  }

  getUnblockUserEndpoint<T>(itemId: string): Observable<T> {
    let endpointUrl = `${this.unblockUserUrl}/${itemId}`;

    return this.http.put<T>(endpointUrl, null, this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getUnblockUserEndpoint(itemId));
      }));
  }

  getDeleteUserEndpoint<T>(itemId: string): Observable<T> {
    let endpointUrl = `${this.controllerUrl}/${itemId}`;

    return this.http.delete<T>(endpointUrl, this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getDeleteUserEndpoint(itemId));
      }));
  }





  getRoleEndpoint<T>(roleId: string): Observable<T> {
    let endpointUrl = `${this.rolesUrl}/${roleId}`;

    return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getRoleEndpoint(roleId));
      }));
  }


  getRoleByRoleNameEndpoint<T>(roleName: string): Observable<T> {
    let endpointUrl = `${this.roleByRoleNameUrl}/${roleName}`;

    return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getRoleByRoleNameEndpoint(roleName));
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
