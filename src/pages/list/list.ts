import { CRSCubicle } from './../../models/CRSCubicle';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {CubiclesProvider} from "../../providers/cubicles/cubicles";
import {AngularFireList  } from "angularfire2/database";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  // cubicles: CRSCubicle[];
  cubicles: AngularFireList<CRSCubicle[]>;
  constructor(public navCtrl: NavController, public navParams: NavParams, private cubiclesService: CubiclesProvider ) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

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
    this.getAllCubicles();  // refresh    TODO: this won't be needed by using Firebase realtime observable
  }

  releaseCubicle(id: number) {
    this.cubiclesService.releaseCubicle(id);
    this.getAllCubicles();  // refresh  TODO: this won't be needed by using Firebase realtime observable
  }
}
