import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { CubiclesProvider } from '../../providers/cubicles/cubicles';
import { LoginAndRegistrationProvider } from '../../providers/login-and-registration/login-and-registration';
import { CRSCubicle } from './../../models/CRSCubicle';
import { CRSUser } from './../../models/CRSUser';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';


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
  constructor(public navCtrl: NavController, public navParams: NavParams, private cubiclesService: CubiclesProvider, 
    private lrService: LoginAndRegistrationProvider, private qrScanner: QRScanner ) {
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
    console.log(this.user);
  }

  releaseCubicle(id: number) {
    this.cubiclesService.releaseCubicle(id);
    console.log(this.user);
  }

  logDrag(item) {
    let percent = item.getSlidingPercent();
    if (percent > 0) {
      // positive
      console.log('right side');
    } else {
      // negative
      console.log('left side');
    }
    if (Math.abs(percent) > 1) {
      console.log('overscroll');
    }
  }

  scanQRCode() {
    this.qrScanner.prepare()
  .then((status: QRScannerStatus) => {
     if (status.authorized) {
       // camera permission was granted


       // start scanning
       let scanSub = this.qrScanner.scan().subscribe((text: string) => {
         console.log('Scanned something', text);

         this.qrScanner.hide(); // hide camera preview
         scanSub.unsubscribe(); // stop scanning
       });

       // show camera preview
       this.qrScanner.show();

       // wait for user to scan something, then the observable callback will be called

     } else if (status.denied) {
       // camera permission was permanently denied
       // you must use QRScanner.openSettings() method to guide the user to the settings page
       // then they can grant the permission from there
     } else {
       // permission was denied, but not permanently. You can ask for permission again at a later time.
     }
  })
  .catch((e: any) => console.log('Error is', e));

  }

  

}
