import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireObject } from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {LoginAndRegistrationProvider} from "../../providers/login-and-registration/login-and-registration";
import {MessagingProvider} from "../../providers/messaging/messaging";
import { CRSCubicle } from './../../models/CRSCubicle';

/*
  Generated class for the CubiclesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CubiclesProvider {

  cubicles: CRSCubicle[];

  constructor(private afDatabase: AngularFireDatabase, private lrService: LoginAndRegistrationProvider, private messagingService: MessagingProvider ) {
    console.log('Hello CubiclesProvider Provider');
  }

  getAllCubibles() {
    return Observable.create(observer => {
          this.afDatabase.database.ref().child('cubicles').once('value').then((snapshot) => {
            this.cubicles = snapshot.val();
            observer.next(this.cubicles ); 
          });
      });
  }

  reserveCubicle(id: number) {
    console.log("reserving cubicle " + id + " for " + this.lrService.user.name);
    this.afDatabase.database.ref('cubicles/'+id).update({person: this.lrService.user.uid, personName: this.lrService.user.name});
    this.messagingService.toast("You are all set. We have secured your space!");
  }

  releaseCubicle(id: number) {
    this.afDatabase.database.ref('cubicles/'+id).update({person: null, personName: null});
    this.messagingService.toast("Thank you for releasing this space");
  }

}
