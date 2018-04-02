import { Injectable } from '@angular/core';
import {AngularFireDatabase } from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {LoginAndRegistrationProvider} from "../../providers/login-and-registration/login-and-registration";
import { CRSCubicle } from './../../models/CRSCubicle';
import {AngularFireAuth} from "angularfire2/auth";

/*
  Generated class for the CubiclesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CubiclesProvider {

  cubicles: CRSCubicle[];

  constructor(private afDatabase: AngularFireDatabase, private afAuth:AngularFireAuth, private lrService: LoginAndRegistrationProvider ) {
    console.log('Hello CubiclesProvider Provider');
  }

  getAllCubibles() :Observable<CRSCubicle[]> {
    return this.afDatabase.list<CRSCubicle>('/cubicles').valueChanges();   

  }

  reserveCubicle(id: number) {
    console.log('reserving ' + id );
    this.releaseCubicle(this.lrService.user.cubicle);

    this.afDatabase.database.ref('cubicles/'+id).update({person: this.lrService.user.uid, personName: this.lrService.user.name});
    let peopleURI = "people/" + this.afAuth.auth.currentUser.uid;
    this.lrService.user.cubicle = id;    
    this.afDatabase.database.ref().child(peopleURI).update({cubicle: this.lrService.user.cubicle});
  }

  releaseCubicle(id: number) {
    console.log('releasing ' + id );
    this.afDatabase.database.ref('cubicles/'+id).update({person: null, personName: null});
    this.lrService.user.cubicle = null;    // TODO: this will work once firebase async is connected
    let peopleURI = "people/" + this.afAuth.auth.currentUser.uid;
    this.afDatabase.database.ref().child(peopleURI).update({cubicle: this.lrService.user.cubicle});
  }



}
