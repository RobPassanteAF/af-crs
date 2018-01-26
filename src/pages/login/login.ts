import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import {HomePage} from "../home/home";
import {RegisterPage} from "../register/register";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(private afAuth:AngularFireAuth, private toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(form) {
    this.afAuth.auth.signInWithEmailAndPassword(form.value.email, form.value.password).then((authData) => {
      console.log(authData);
    }).catch((error) => {
      const toast = this.toastCtrl.create({
        message: error.message,
        showCloseButton: true,
        closeButtonText: 'Ok'
      });
      toast.present();
    });
  }

  startRegistration() {
    this.navCtrl.push(RegisterPage);
  }
}
