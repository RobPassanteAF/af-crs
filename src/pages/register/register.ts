import {Component, OnInit} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {LoginAndRegistrationProvider} from "../../providers/login-and-registration/login-and-registration";
import {MessagingProvider} from "../../providers/messaging/messaging";
import {CRSUser} from "../../models/CRSUser";
import { TabsPage } from '../tabs/tabs';

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
export class RegisterPage implements OnInit{

  user: CRSUser;

  constructor(private lrService: LoginAndRegistrationProvider, private messagingService: MessagingProvider, public navCtrl: NavController, public navParams: NavParams) {

  }

  ngOnInit (){
    this.lrService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  ionViewDidLoad() {

  }

  finishRegistration(form:NgForm) {
    if(form.value.pw1 === form.value.pw2){
      const fullName = form.value.firstName + " " + form.value.lastName
      this.lrService.finalizeRegistration(form.value.pw1, fullName).subscribe((result) => {
        this.navCtrl.setRoot(TabsPage);
      }, err => {
        this.messagingService.toast(err.message);
      });
    }

  }


}
