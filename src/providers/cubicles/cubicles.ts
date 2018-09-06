import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {LoginAndRegistrationProvider} from "../login-and-registration/login-and-registration";
import { CRSCubicle } from '../../models/CRSCubicle';
import {AngularFireAuth} from "angularfire2/auth";
import { AngularFirestore } from 'angularfire2/firestore';
import { CRSCubeInfo } from '../../models/CRSCubeInfo';
import { LocateCube } from '../../models/LocateCube';

/*
  Generated class for the CubiclesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CubiclesProvider {

  emptyCubicles: number;
  lastReleaseAllDate: Date;
  cubeInfo: CRSCubeInfo;
  cubeToLocate: LocateCube;

  constructor(private afs: AngularFirestore, private afAuth:AngularFireAuth, private lrService: LoginAndRegistrationProvider ) {

  }

  getAllCubibles() :Observable<CRSCubicle[]> {
    return this.afs.collection<CRSCubicle>('/cubicles', ref => ref.orderBy('empty','desc')).valueChanges();
  }

  getCubeInfo() :Observable<CRSCubeInfo> {
    return this.afs.collection('/cubeInfo').doc<CRSCubeInfo>('info').valueChanges();
  }

  setCubeInfo( info: CRSCubeInfo ):void {
    this.cubeInfo = info;
  }

  getLastReleaseAllDate() :Observable<CRSCubeInfo> {
    return this.afs.collection('/cubeInfo').doc<CRSCubeInfo>('info').valueChanges();
  }

  setLastReleaseAllDate( lastReleaseAllDate: Date ):void {
    this.afs.collection('/cubeInfo').doc('info').update({lastReleaseAllDate:lastReleaseAllDate});   // not swapping, so one less
    this.lastReleaseAllDate = lastReleaseAllDate;
  }

  getEmptyCubicles(): Observable<any> {
    return this.afs.collection('cubicles', ref => ref.where('empty', '==', true)).valueChanges();
  }

  reserveCubicle(id: string): Promise<any> {
    if( this.lrService.user.cubicle ) {
      //USER HAS A CUBE WE NEED TO RELEASE IT
      this.releaseCubicle(this.lrService.user.cubicle, null).then( (releaseResult) => {
        return this.processReservation(id)
      });
    } else {
      return this.processReservation(id);
    }
  }

  private processReservation(id: string): Promise<any> {
    let cubeRef = this.afs.collection<CRSCubicle>('cubicles/').doc(id);
    cubeRef.update({person: this.lrService.user.uid, empty: false});
    this.lrService.user.cubicle = id;
    let personRef = this.afs.collection('people').doc(this.afAuth.auth.currentUser.uid);
    return personRef.update({cubicle: this.lrService.user.cubicle, wfh: false});
  }

  releaseCubicle(id: string, wfh: boolean ): Promise<any> {
    let cubeRef = this.afs.collection<CRSCubicle>('cubicles/').doc(id);
    cubeRef.update({person: null, empty: true});
    this.lrService.user.cubicle = null;
    let personRef = this.afs.collection('people').doc(this.afAuth.auth.currentUser.uid);
    return personRef.update({cubicle: null, wfh: wfh});
  }

  getCubeToLocate() : LocateCube {
    return this.cubeToLocate;
  }

  setCubeToLocate( locate: LocateCube ): void {
    this.cubeToLocate = locate;
  }

}
