import { Injectable } from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";
import {MessagingProvider} from "../messaging/messaging";
import {Observable} from "rxjs/Observable";
import {CRSUser} from "../../models/CRSUser";

/*
  Generated class for the LoginAndRegistrationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginAndRegistrationProvider {

  user: CRSUser;

  constructor(private afAuth:AngularFireAuth, private afDatabase: AngularFireDatabase, private messagingService: MessagingProvider) {
    console.log('Hello LoginAndRegistrationProvider Provider');
  }

  getUser() {
    return this.user;
  }

  login(email,password) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then((user) => {
      console.log(user);
    }).catch((error) => {
      this.messagingService.toast(error.message,true);
    });
  }

  checkInvitation(code){
    let invitationURI = "invitations/" + code;
    return Observable.create(observer => {
      this.afDatabase.database.ref().child(invitationURI).once('value').then((snapshot) => {
        let inv = snapshot.val();
        if(inv){
          this.user = new CRSUser();
          this.user.fillFromInvitation(code, inv.name, inv.email);
          observer.next(this.user);
        }else {
          this.messagingService.toast("Invalid Invitation Code. Try Again.",false);
          observer.error();
        }
      });
    });
  }

  finalizeRegistration(password){
    return Observable.create(observer => {
      this.afAuth.auth.createUserWithEmailAndPassword(this.user.email, password).then((newUser) => {
        observer.next(true);
      }).catch((error) => {
        this.messagingService.toast(error.message,true);
        observer.error();
      });
    });
  }
}
