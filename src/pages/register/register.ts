import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {LoginAndRegistrationProvider} from "../../providers/login-and-registration/login-and-registration";
import {CRSUser} from "../../models/CRSUser";
import {HomePage} from "../home/home";

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user:CRSUser;

  constructor(private lrService: LoginAndRegistrationProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.user = this.lrService.getUser();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  finishRegistration(form:NgForm) {
    if(form.value.pw1 === form.value.pw2){
      this.lrService.finalizeRegistration(form.value.pw1).subscribe((result) => {
        this.navCtrl.push(HomePage);
      }, err => {
        console.log('REGISTRATION ERROR');
      });
    }

  }
}
