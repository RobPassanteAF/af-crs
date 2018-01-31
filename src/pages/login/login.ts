import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {RegisterPage} from "../register/register";
import {NgForm} from "@angular/forms";
import {LoginAndRegistrationProvider} from "../../providers/login-and-registration/login-and-registration";
import {MessagingProvider} from "../../providers/messaging/messaging";

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

  public invitationCode:string = "fd875a4f-2679-427f-865b-0707a78ec2cc";

  constructor(private lrService: LoginAndRegistrationProvider, private messagingService:MessagingProvider, public navCtrl: NavController) {

  }

  ionViewDidLoad() {

  }

  login(form: NgForm) {
    this.lrService.login(form.value.email, form.value.password);
  }

  validateInvitation(form: NgForm) {
    this.lrService.checkInvitation(form.value.invitationCode).subscribe(invitation => {
      console.log(invitation);
      this.navCtrl.push(RegisterPage);
    }, err => {
      this.messagingService.toast(err.message)
    });
  }

}
