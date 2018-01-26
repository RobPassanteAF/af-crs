import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {FormsModule} from "@angular/forms";
import {AngularFireModule} from "angularfire2";
import {LoginPage} from "../pages/login/login";
import {AngularFireAuth} from "angularfire2/auth";
import {RegisterPage} from "../pages/register/register";

export const firebaseConfig = {
  apiKey: "AIzaSyDdO-kUI-XnVEhRdGbxS3hgVaPeAhN0UBY",
  authDomain: "af-crs.firebaseapp.com",
  databaseURL: "https://af-crs.firebaseio.com",
  projectId: "af-crs",
  storageBucket: "af-crs.appspot.com",
  messagingSenderId: "872123214077"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireAuth,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
