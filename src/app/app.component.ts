import {Component, ViewChild} from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {AngularFireAuth} from "angularfire2/auth";
import {LoginPage} from "../pages/login/login";
import {ReservePage} from '../pages/reserve/reserve';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(private afAuth: AngularFireAuth, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    const unsubscribe = this.afAuth.auth.onAuthStateChanged( user => {
      if (!user) {
        this.rootPage = LoginPage;
        unsubscribe();
      } else {
        this.rootPage = HomePage;
        unsubscribe();
      }
    });

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage },
      { title: 'Reserve', component: ReservePage }
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
    this.nav.setRoot(page.component);
  }
}
