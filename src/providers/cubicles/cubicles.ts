import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {LoginAndRegistrationProvider} from "../../providers/login-and-registration/login-and-registration";

/*
  Generated class for the CubiclesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CubiclesProvider {

  constructor(private afDatabase: AngularFireDatabase, private lrService: LoginAndRegistrationProvider) {
    console.log('Hello CubiclesProvider Provider');
  }

  getAllCubibles() {
    return Observable.create(observer => {
          this.afDatabase.database.ref().child('cubicles').once('value').then((snapshot) => {
            observer.next(snapshot.val()); 
          });
      });
  }

  reserveCubicle(id: number) {
    console.log("reserving cubicle " + id + " for " + this.lrService.user.name);
    this.afDatabase.database.ref('cubicles/'+id).update({person: this.lrService.user.uid});
  }

  releaseCubicle(id: number) {
    this.afDatabase.database.ref('cubicles/'+id).update({person: null});
  }

}
