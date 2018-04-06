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
  emptyCubicles: number;

  constructor(private afDatabase: AngularFireDatabase, private afAuth:AngularFireAuth, private lrService: LoginAndRegistrationProvider ) {
    this.getEmptyCubicles().subscribe(val => this.emptyCubicles = val);
  }

  getAllCubibles() :Observable<CRSCubicle[]> {
    return this.afDatabase.list<CRSCubicle>('/cubicles').valueChanges();
  }

  getEmptyCubicles() :Observable<number> {
    return this.afDatabase.object<number>('/emptyCubicles').valueChanges();
  }

  reserveCubicle(id: number) {
    console.log('reserving ' + id );
    let releasing= false;
    if(this.lrService.user.cubicle == null ) {
      console.log("not null");
      this.afDatabase.database.ref('/').update({emptyCubicles:this.emptyCubicles-1});   // not swapping, so one less cubicle
    }

    this.releaseCubicle(this.lrService.user.cubicle, releasing);

    this.afDatabase.database.ref('cubicles/'+id).update({person: this.lrService.user.uid, personName: this.lrService.user.name});
    let peopleURI = "people/" + this.afAuth.auth.currentUser.uid;
    this.lrService.user.cubicle = id;
    this.afDatabase.database.ref().child(peopleURI).update({cubicle: this.lrService.user.cubicle});

  }

  releaseCubicle(id: number, releasing = true ) {
    if(releasing) {
      this.afDatabase.database.ref('/').update({emptyCubicles:this.emptyCubicles+1});   // actually releasing the cubicle so one more empty cubicle
    }

    console.log('releasing ' + id );
    this.afDatabase.database.ref('cubicles/'+id).update({person: null, personName: null});
    this.lrService.user.cubicle = null;    // TODO: this will work once firebase async is connected
    let peopleURI = "people/" + this.afAuth.auth.currentUser.uid;
    this.afDatabase.database.ref().child(peopleURI).update({cubicle: this.lrService.user.cubicle});
  }
}
