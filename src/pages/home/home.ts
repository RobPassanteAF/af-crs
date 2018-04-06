import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {MessagingProvider} from "../../providers/messaging/messaging";
import { CubiclesProvider } from '../../providers/cubicles/cubicles';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  emptyCubicles: Observable<number>;

  constructor(public navCtrl: NavController,  private messagingService: MessagingProvider, private cubiclesService: CubiclesProvider) {
    this.emptyCubicles = this.cubiclesService.getEmptyCubicles();
  }

  selectLocation(location: string) {
    this.messagingService.toast("You are at " + location);
  }

}
