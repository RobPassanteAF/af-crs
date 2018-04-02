import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {ReservePage} from '../pages/reserve/reserve';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {FormsModule} from "@angular/forms";
import {AngularFireModule} from "angularfire2";
import {LoginPage} from "../pages/login/login";
import {AngularFireAuth} from "angularfire2/auth";
import {RegisterPage} from "../pages/register/register";
import {AngularFireDatabase} from "angularfire2/database";
import { LoginAndRegistrationProvider } from '../providers/login-and-registration/login-and-registration';
import { MessagingProvider } from '../providers/messaging/messaging';
import { CubiclesProvider } from '../providers/cubicles/cubicles';
import {ProfilePage} from "../pages/profile/profile";
import { TeamsProvider } from '../providers/teams/teams';
import { AppSettings } from '../providers/app-settings/app-settings';
import {TabsPage} from "../pages/tabs/tabs";
import { QRScanner } from '@ionic-native/qr-scanner';
import { PhotoViewer } from '@ionic-native/photo-viewer';

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
    TabsPage,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage,
    ReservePage,
    RegisterPage,
    ProfilePage
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
    TabsPage,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage,
    ReservePage,
    RegisterPage,
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireAuth,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginAndRegistrationProvider,
    MessagingProvider,
    TeamsProvider,
    MessagingProvider,
    CubiclesProvider,
    AppSettings,
    QRScanner,
    PhotoViewer
  ]
})
export class AppModule {}
