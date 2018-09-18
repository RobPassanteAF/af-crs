import { Component } from '@angular/core';
import { CRSCubicle } from "../../models/CRSCubicle";
import { CubiclesProvider } from "../../providers/cubicles/cubicles";
import { MessagingProvider } from "../../providers/messaging/messaging";
import { QRScannerStatus, QRScanner } from '@ionic-native/qr-scanner';
import { CRSUser } from '../../models/CRSUser';
import { LoginAndRegistrationProvider } from '../../providers/login-and-registration/login-and-registration';
import { Observable } from "rxjs/Observable";
import { LocateCube } from '../../models/LocateCube';

/**
 * Generated class for the ReservePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-reserve',
  templateUrl: 'reserve.html',
})
export class ReservePage {

  user: CRSUser;
  viewType: string;
  cubicles: Observable<CRSCubicle[]>;
  locateUser: string;

  constructor( private cubiclesService: CubiclesProvider, private lrService: LoginAndRegistrationProvider,
    private messagingService: MessagingProvider, private qrScanner: QRScanner) {
    this.user = this.lrService.user;
    this.getAllCubicles();
  }

  ionViewDidEnter() {
    this.viewType = "map";
    console.log('reserve view loaded');
    const locate: LocateCube = this.cubiclesService.getCubeToLocate();
    if( locate ){
      this.locateUser = locate.uid;
      this.messagingService.toast('Locating ' + locate.name );
    }
  }

  ionViewDidLeave() {
    this.locateUser = null;
    this.cubiclesService.setCubeToLocate(null);
  }

  locateCube( cube:CRSCubicle ): void {
    if(cube.person){
      this.locateUser = cube.person;
      this.messagingService.toast('Locating ' + cube.personName );
    }else{
      this.locateUser = cube.cubeId;
      this.messagingService.toast('Locating ' + cube.cubeId );
    }
    this.viewType = "map";
  }

  private getAllCubicles() {
    this.cubicles = this.cubiclesService.getAllCubibles();
  }

  getButtonColor(cube:CRSCubicle):string {
    let color = 'primary';
    if(cube.person){
      color = 'warning';
    }
    return 'danger';
  }

  toggleCube(cube:CRSCubicle) {
    if(cube.permanent) return;
    let msg;

    if(cube.person && cube.person === this.user.uid){
      this.cubiclesService.releaseCubicle(cube.cubeId, null);
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
     //   (window.document.querySelector('.listContent') as HTMLElement).classList.add('hideScrollContent');

        let scanSub = this.qrScanner.scan().subscribe((scannedCubicleId: string) => {
        console.log('Scanned something', scannedCubicleId);

        let tempCube:CRSCubicle = new CRSCubicle();
        tempCube.cubeId = scannedCubicleId;
        this.toggleCube(tempCube);

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
