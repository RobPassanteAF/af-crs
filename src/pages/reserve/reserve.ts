import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { CRSCubicle } from "../../models/CRSCubicle";
import { CubiclesProvider } from "../../providers/cubicles/cubicles";
import { MessagingProvider } from "../../providers/messaging/messaging";
import { QRScannerStatus, QRScanner } from '@ionic-native/qr-scanner';
import { CRSUser } from '../../models/CRSUser';
import { LoginAndRegistrationProvider } from '../../providers/login-and-registration/login-and-registration';
import { Observable } from "rxjs/Observable";

/**
 * Generated class for the ReservePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reserve',
  templateUrl: 'reserve.html',
})
export class ReservePage {

  user: CRSUser;
  viewType: string;
  cubicles: Observable<CRSCubicle[]>;

  constructor( private cubiclesService: CubiclesProvider, private lrService: LoginAndRegistrationProvider,
    private messagingService: MessagingProvider, private qrScanner: QRScanner) {
    this.user = this.lrService.user;
    this.getAllCubicles();
  }

  ionViewDidLoad() {
    this.viewType = "map";
  }

  private getAllCubicles() {
    this.cubicles = this.cubiclesService.getAllCubibles();
  }

  toggleCube(cube:CRSCubicle) {
    if(cube.permanent) return;
    let msg;

    if(cube.person && cube.person === this.user.uid){
      this.cubiclesService.releaseCubicle(cube.cubeId);
      msg = 'Cubicle Released';
    } else if (!cube.person) {
      this.cubiclesService.reserveCubicle(cube.cubeId);
      msg = 'Cubicle Reserved';
    }
    this.messagingService.toast(msg);
  }

  scanQRCode() {
    this.qrScanner.prepare().then( (status: QRScannerStatus) => {
      if (status.authorized) {
        (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
        (window.document.querySelector('.listContent') as HTMLElement).classList.add('hideScrollContent');

        let scanSub = this.qrScanner.scan().subscribe((scannedCubicleId: string) => {
        console.log('Scanned something', scannedCubicleId);

        this.toggleCube(scannedCubicleId);

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
    }).catch( (e: any) => {
      console.log('Error is', e);
    });

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

}
