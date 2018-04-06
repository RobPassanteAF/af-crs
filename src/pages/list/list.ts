import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {CubiclesProvider} from "../../providers/cubicles/cubicles";
import {MessagingProvider} from "../../providers/messaging/messaging";
import {LoginAndRegistrationProvider} from "../../providers/login-and-registration/login-and-registration";
import {CRSCubicle} from "./../../models/CRSCubicle";
import {CRSUser} from "./../../models/CRSUser";
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {Observable} from "rxjs/Observable";


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
    private lrService: LoginAndRegistrationProvider, private qrScanner: QRScanner, private messagingService: MessagingProvider ) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.user = this.lrService.user;

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

  reserveCubicle(id: number) {
    this.cubiclesService.reserveCubicle(id);
    this.messagingService.toast("You are all set. We have secured your space!");
    console.log(this.user);
  }

  releaseCubicle(id: number) {
    this.cubiclesService.releaseCubicle(id);
    this.messagingService.toast("Thank you for releasing this space");
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

      (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
      (window.document.querySelector('.listContent') as HTMLElement).classList.add('hideScrollContent');

       let scanSub = this.qrScanner.scan().subscribe((scannedCubicleId: string) => {
        console.log('Scanned something', scannedCubicleId);

         this.reserveCubicle(Number(scannedCubicleId));

         this.qrScanner.hide(); // hide camera preview
         (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
         (window.document.querySelector('.listContent') as HTMLElement).classList.remove('hideScrollContent');
         scanSub.unsubscribe(); // stop scanning
       });

       // show camera preview
       this.qrScanner.show();

     } else if (status.denied) {
       console.log('permision denied');
     } else {
      console.log('permision denied');    // DO something over here to alert the user
     }
  })
  .catch((e: any) => console.log('Error is', e));

  }



}
