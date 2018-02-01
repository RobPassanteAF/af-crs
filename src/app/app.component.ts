import {Component, ViewChild} from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {LoginPage} from "../pages/login/login";
import {ReservePage} from '../pages/reserve/reserve';
import {ProfilePage} from "../pages/profile/profile";
import {LoginAndRegistrationProvider} from "../providers/login-and-registration/login-and-registration";
import {AppSettings} from "../providers/app-settings/app-settings";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(public lrService: LoginAndRegistrationProvider, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {

    this.lrService.init().subscribe( (user) => {
      this.rootPage = HomePage;
      this.initializeApp();
    }, (err) => {
      switch (err){
        case AppSettings.AUTH_ERRORS.LOGIN_REQUIRED.code:
          this.openPage(LoginPage);
          break;
        case AppSettings.AUTH_ERRORS.PROFILE_INCOMPLETE.code:
          this.openPage(ProfilePage);
          break;
        case AppSettings.AUTH_ERRORS.PROFILE_MISSING.code:
          this.openPage(ProfilePage);
          break;
      }
      //this.initializeApp();
    });

    //this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage },
      { title: 'Reserve', component: ReservePage },
      { title: 'My Profile', component: ProfilePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.component){
      this.nav.setRoot(page.component);
    }else {
      this.nav.setRoot(page);
    }
  }
}
