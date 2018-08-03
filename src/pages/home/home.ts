import { Component, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import {MessagingProvider} from "../../providers/messaging/messaging";
import { CubiclesProvider } from '../../providers/cubicles/cubicles';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnDestroy {
  emptyCubicles: Observable<number>;

  constructor(public navCtrl: NavController,  private messagingService: MessagingProvider, private cubiclesService: CubiclesProvider) {
    this.emptyCubicles = this.cubiclesService.getEmptyCubicles();
  }

  ngOnDestroy(){
    console.log('destroying home');
  }

  selectLocation(location: string) {
    this.messagingService.toast("You are at " + location);
  }



}
