import {Component, ViewChild} from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LoginPage} from "../pages/login/login";
import {ProfilePage} from "../pages/profile/profile";
import {LoginAndRegistrationProvider} from "../providers/login-and-registration/login-and-registration";
import {AppSettings} from "../providers/app-settings/app-settings";
import {TabsPage} from "../pages/tabs/tabs";
import { CubiclesProvider } from '../providers/cubicles/cubicles';
import { AngularFireAuth } from 'angularfire2/auth';


@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TabsPage;

  constructor(private afAuth:AngularFireAuth,public lrService: LoginAndRegistrationProvider, public cubicleSvc: CubiclesProvider, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {

    this.lrService.init().subscribe( () => {
      this.rootPage = TabsPage;
      this.initializeApp();
    }, (err) => {
      switch (err){
        case AppSettings.AUTH_ERRORS.LOGIN_REQUIRED.code:
          this.setRoot(LoginPage);
          break;
        case AppSettings.AUTH_ERRORS.PROFILE_INCOMPLETE.code:
          this.setRoot(ProfilePage);
          break;
        case AppSettings.AUTH_ERRORS.PROFILE_MISSING.code:
          this.setRoot(ProfilePage);
          break;
      }
    });

    this.afAuth.auth.onAuthStateChanged( (authState) => {
      if(!authState && this.lrService.user){
        this.setRoot(LoginPage);
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  setRoot(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page).then( () => {

    });
  }
}
