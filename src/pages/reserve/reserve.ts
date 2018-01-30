import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CubiclesProvider} from "../../providers/cubicles/cubicles";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private cubiclesService: CubiclesProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReservePage');
    this.cubiclesService.getAllCubibles().subscribe(cubicles => {
      console.log(cubicles);
    });

  }

  selectCubicle(id: number) {
    alert('Selected ' + id);
  
  }

}
