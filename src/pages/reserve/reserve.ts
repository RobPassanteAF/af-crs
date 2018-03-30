import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CubiclesProvider} from "../../providers/cubicles/cubicles";
import {MessagingProvider} from "../../providers/messaging/messaging";
import {CRSCubicle} from "../../models/CRSCubicle";
import {Observable} from "rxjs/Observable";

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

  cubicles: Observable<CRSCubicle[]>;
  hotelCubes = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private cubiclesService: CubiclesProvider, private messagingService: MessagingProvider) {
    this.getAllCubicles();
    this.hotelCubes.push({id:0,reserved:false});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReservePage');
    // this.cubiclesService.getAllCubibles().subscribe(cubicles => {
    //   console.log(cubicles);
    // });

  }

  getHotelCubeClass(id: number) {
    let c = 'rect ';
    if( this.hotelCubes[0].reserved ){
      c = c + 'reserved';
    }else {
      c = c + 'open';
    }
    return c;
  }

  private getAllCubicles() {
    this.cubicles = this.cubiclesService.getAllCubibles();
  }

  toggleCube(id: number) {
    let msg;
    if(this.hotelCubes[id].reserved){
      this.cubiclesService.releaseCubicle(id);
      msg = 'Cubicle Reserved';
    } else {
      this.cubiclesService.reserveCubicle(id);
      msg = 'Cubicle Released';
    }
    this.hotelCubes[id].reserved = !this.hotelCubes[id].reserved;
    this.messagingService.toast(msg);
  }

}
