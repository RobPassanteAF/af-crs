import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {LoginAndRegistrationProvider} from "../login-and-registration/login-and-registration";
import { CRSCubicle } from '../../models/CRSCubicle';
import {AngularFireAuth} from "angularfire2/auth";
import { AngularFirestore } from 'angularfire2/firestore';
import { CRSCubeCounts } from '../../models/CRSCubeCounts';

/*
  Generated class for the CubiclesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CubiclesProvider {

  emptyCubicles: number;
  lastReleaseAllDate: Date;
  staticCubeCountId: string = 'IVMR4ftFaiHyUb9YI2Q2';
  cubeCounts: CRSCubeCounts;


  constructor(private afs: AngularFirestore, private afAuth:AngularFireAuth, private lrService: LoginAndRegistrationProvider ) {

  }

  getAllCubibles() :Observable<CRSCubicle[]> {
    return this.afs.collection<CRSCubicle>('/cubicles').valueChanges();
  }

  getCubeCounts() :Observable<CRSCubeCounts> {
    return this.afs.collection('/cubeCounts').doc<CRSCubeCounts>(this.staticCubeCountId).valueChanges();
  }

  setCubeCounts( counts: CRSCubeCounts ):void {
    this.cubeCounts = counts;
  }

  getLastReleaseAllDate() :Observable<CRSCubeCounts> {
    return this.getCubeCounts();
  }

  setLastReleaseAllDate( lastReleaseAllDate: Date ):void {
    this.afs.collection('/cubeCounts').doc(this.staticCubeCountId).update({lastReleaseAllDate:lastReleaseAllDate});   // not swapping, so one less
    this.lastReleaseAllDate = lastReleaseAllDate;
  }

  reserveCubicle(id: string) {
    console.log('reserving ' + id );
    let releasing= false;
    if(this.lrService.user.cubicle == null ) {
      console.log("not null");
      this.cubeCounts.emptyCubes = this.cubeCounts.emptyCubes - 1;
      let cubeCountRef = this.afs.collection<CRSCubeCounts>('/cubeCounts');

      cubeCountRef.doc(this.staticCubeCountId).set(this.cubeCounts);   // not swapping, so one less cubicle
    }

    this.releaseCubicle(this.lrService.user.cubicle, releasing);

    let cubeRef = this.afs.collection<CRSCubicle>('cubicles/').doc(id);
    cubeRef.update({person: this.lrService.user.uid, personName: this.lrService.user.fullName});
    this.lrService.user.cubicle = id;
    let personRef = this.afs.collection('people').doc(this.afAuth.auth.currentUser.uid);
    personRef.update({cubicle: this.lrService.user.cubicle});
  }

  releaseCubicle(id: string, releasing = true ) {
    if(releasing) {
      this.cubeCounts.emptyCubes = this.cubeCounts.emptyCubes + 1;
      let cubeCountRef = this.afs.collection<CRSCubeCounts>('/cubeCounts');
      cubeCountRef.doc(this.staticCubeCountId).set(this.cubeCounts);   // actually releasing the cubicle so one more empty cubicle
    }

    console.log('releasing ' + id );
    let cubeRef = this.afs.collection<CRSCubicle>('cubicles/').doc(id);
    cubeRef.update({person: null, personName: null});
    this.lrService.user.cubicle = null;    // TODO: this will work once firebase async is connected
    let personRef = this.afs.collection('people').doc(this.afAuth.auth.currentUser.uid);
    personRef.update({cubicle: this.lrService.user.cubicle});
  }

}
