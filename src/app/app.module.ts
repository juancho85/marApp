import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {AddPage} from "../pages/add/add";
import {FilterPage} from "../pages/filter/filter";
import {LoginPage} from "../pages/login/login";
import {SignupPage} from "../pages/signup/signup";
import {AuthService} from "../services/auth-service";
import {ItemService} from "../services/item-service";
import {CalculationService} from "../services/calculation-service";
import {RemovePage} from "../pages/remove/remove";
import {SaveOptionsPage} from "../pages/save-options/save-options";
import { LOCALE_ID } from '@angular/core';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AddPage,
    FilterPage,
    LoginPage,
    SignupPage,
    RemovePage,
    SaveOptionsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AddPage,
    FilterPage,
    LoginPage,
    SignupPage,
    RemovePage,
    SaveOptionsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, AuthService, ItemService, CalculationService, { provide: LOCALE_ID, useValue: "es" }]
})
export class AppModule {}
