import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {Observable} from "rxjs/Observable";

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
    return Observable.create(observer => {
          this.afDatabase.database.ref().child('cubicles').once('value').then((snapshot) => {
            observer.next(snapshot.val()); 
          });
      });
  }

}
