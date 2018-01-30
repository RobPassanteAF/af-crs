import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";

/*
  Generated class for the CubiclesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CubiclesProvider {

  constructor(private afDatabase: AngularFireDatabase) {
    console.log('Hello CubiclesProvider Provider');
    
  }

  getAllCubibles() {
      this.afDatabase.database.ref().child('cubicles').once('value').then((snapshot) => {
        let inv = snapshot.val();
        if(inv){
         console.log(inv); 
        }
      });
  }

}
