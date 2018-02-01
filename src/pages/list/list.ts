import { CRSCubicle } from './../../models/CRSCubicle';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {CubiclesProvider} from "../../providers/cubicles/cubicles";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  cubicles: CRSCubicle[];

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

    this.cubiclesService.getAllCubibles().subscribe(data => {
      this.cubicles = data;
    });
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListPage, {
      item: item
    });
  }

  reserveCubicle(id: number) {
    alert('Selected ' + id);
    this.cubiclesService.reserveCubicle(id);
  }

  releaseCubicle(id: number) {
    alert('Selected ' + id);
    this.cubiclesService.releaseCubicle(id);
  }
}
