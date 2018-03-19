import { CRSUser } from './../../models/CRSUser';
import { CRSCubicle } from './../../models/CRSCubicle';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {CubiclesProvider} from "../../providers/cubicles/cubicles";   
import {Observable} from "rxjs/Observable";
import {LoginAndRegistrationProvider} from "../../providers/login-and-registration/login-and-registration";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  user: CRSUser;
  items: Array<{title: string, note: string, icon: string}>;
  // cubicles: CRSCubicle[];
  cubicles: Observable<CRSCubicle[]>;
  constructor(public navCtrl: NavController, public navParams: NavParams, private cubiclesService: CubiclesProvider, private lrService: LoginAndRegistrationProvider ) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.user = this.lrService.user;

    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    for (let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }

    this.getAllCubicles();
  }

  private getAllCubicles() {
   this.cubicles = this.cubiclesService.getAllCubibles();
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListPage, {
      item: item
    });
  }

  reserveCubicle(id: number) {
    this.cubiclesService.reserveCubicle(id);
  }

  releaseCubicle(id: number) {
    this.cubiclesService.releaseCubicle(id);
  }
}
