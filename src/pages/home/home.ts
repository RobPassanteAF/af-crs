import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {MessagingProvider} from "../../providers/messaging/messaging";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,  private messagingService: MessagingProvider) {

  }

  selectLocation(location: string) {
    this.messagingService.toast("You are at " + location);
  }

}
