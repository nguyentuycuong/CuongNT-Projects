// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

import { NgModule, ErrorHandler } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastaModule } from 'ngx-toasta';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { PopoverModule } from "ngx-bootstrap/popover";
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppErrorHandler } from './app-error.handler';
import { AppTitleService } from './services/app-title.service';
import { AppTranslationService, TranslateLanguageLoader } from './services/app-translation.service';
import { ConfigurationService } from './services/configuration.service';
import { AlertService } from './services/alert.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { EndpointFactory } from './services/endpoint-factory.service';
import { NotificationService } from './services/notification.service';
import { NotificationEndpoint } from './services/notification-endpoint.service';
import { AccountService } from './services/account.service';
import { AccountEndpoint } from './services/account-endpoint.service';

import { EqualValidator } from './directives/equal-validator.directive';
import { LastElementDirective } from './directives/last-element.directive';
import { AutofocusDirective } from './directives/autofocus.directive';
import { BootstrapTabDirective } from './directives/bootstrap-tab.directive';
import { BootstrapToggleDirective } from './directives/bootstrap-toggle.directive';
import { BootstrapSelectDirective } from './directives/bootstrap-select.directive';
import { BootstrapDatepickerDirective } from './directives/bootstrap-datepicker.directive';

import { ImagePreview } from './directives/image-preview.directive';

import { GroupByPipe } from './pipes/group-by.pipe';

import { AppComponent } from "./components/app.component";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { CustomersComponent } from "./components/customers/customers.component";
import { OrdersComponent } from "./components/orders/orders.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";

import { BannerDemoComponent } from "./components/controls/banner-demo.component";
import { TodoDemoComponent } from "./components/controls/todo-demo.component";
import { StatisticsDemoComponent } from "./components/controls/statistics-demo.component";
import { NotificationsViewerComponent } from "./components/controls/notifications-viewer.component";
import { SearchBoxComponent } from "./components/controls/search-box.component";
import { UserInfoComponent } from "./components/controls/user-info.component";
import { UserPreferencesComponent } from "./components/controls/user-preferences.component";
import { UsersManagementComponent } from "./components/controls/users-management.component";
import { RolesManagementComponent } from "./components/controls/roles-management.component";
import { RoleEditorComponent } from "./components/controls/role-editor.component";
import { NavComponent } from './components/nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from './material.module';
import { LayoutComponent } from './layout/layout.component';
import { PublicComponent } from "./layout/public.component";
import { AboutComponent } from "./public/about/about.component";
import { CategoryComponent } from "./components/category/category.component";
import { CategoryService } from "./services/app/category.service";
import { CategoryEditorComponent } from "./components/category/category-editor.component";
import { ProductsCategoryService } from "./services/app/productsCategory.service";
import { ProductsCategoryComponent } from "./components/products/products-category.component";
import { ProductsCategoryEditorComponent } from "./components/products/products-category-editor.component";
import { CategoryServiceEndpoint } from "./services/app/category.endpoint.service";
import { ProductsCategoryServiceEndpoint } from "./services/app/productsCategory.endpoint.service";
import { AppUtilities } from "./services/app/app.utilities";
import { ProductsComponent } from "./components/products/products.component";
import { ProductService } from "./services/app/product.service";
import { ProductServiceEndpoint } from "./services/app/product.endpoint.service";
import { ProductEditorComponent } from "./components/products/products-editor.component";
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { FileUploadModule } from "ng2-file-upload";
import { JoditAngularModule } from "./jodit-angular/public_api";


@NgModule({
  imports: [
    FlexLayoutModule,
    BrowserModule,
    JoditAngularModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateLanguageLoader
      }
    }),
    NgxDatatableModule,
    ToastaModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    ChartsModule,
    LayoutModule,
    MaterialModule,
    CKEditorModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    FileUploadModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    CustomersComponent,
    ProductsComponent,
    OrdersComponent,
    SettingsComponent,
    UsersManagementComponent, UserInfoComponent, UserPreferencesComponent,
    RolesManagementComponent, RoleEditorComponent,
    AboutComponent,
    NotFoundComponent,
    NotificationsViewerComponent,
    SearchBoxComponent,
    StatisticsDemoComponent, TodoDemoComponent, BannerDemoComponent,
    EqualValidator,
    LastElementDirective,
    AutofocusDirective,
    ImagePreview,
    BootstrapTabDirective,
    BootstrapToggleDirective,
    BootstrapSelectDirective,
    BootstrapDatepickerDirective,
    GroupByPipe,
    NavComponent,
    LayoutComponent,
    PublicComponent, CategoryComponent, CategoryEditorComponent,
    ProductsCategoryComponent, ProductsCategoryEditorComponent, ProductEditorComponent,
    
  ],
  providers: [
    { provide: 'BASE_URL', useFactory: getBaseUrl },
    { provide: ErrorHandler, useClass: AppErrorHandler },
    AlertService,
    ConfigurationService,
    AppTitleService,
    AppTranslationService,
    NotificationService,
    NotificationEndpoint,
    AccountService,
    AccountEndpoint,
    LocalStoreManager,
    EndpointFactory,
    CategoryServiceEndpoint,
    CategoryService,
    ProductsCategoryService,
    ProductsCategoryServiceEndpoint,
    AppUtilities, ProductService, ProductServiceEndpoint,
  ],
  bootstrap: [AppComponent],
  entryComponents: [NavComponent]
})
export class AppModule {
}




export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}
