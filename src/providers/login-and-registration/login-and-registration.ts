import { Injectable } from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import {MessagingProvider} from "../messaging/messaging";
import {Observable} from "rxjs/Observable";
import {CRSUser} from "../../models/CRSUser";
import {AppSettings} from "../app-settings/app-settings";
import { CRSTeam } from '../../models/CRSTeam';
import { AngularFirestore } from 'angularfire2/firestore';
import { PasswordChange } from '../../models/PasswordChange';

/*
  Generated class for the LoginAndRegistrationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginAndRegistrationProvider {

  user: CRSUser;
  allUserList: Object = {};

  constructor(private afAuth:AngularFireAuth, private afs: AngularFirestore, private messagingService: MessagingProvider, private appSettings: AppSettings) {
    console.log('Hello LoginAndRegistrationProvider Provider');
  }

  init(){
    return Observable.create(observer => {
      const unsubscribe = this.afAuth.auth.onAuthStateChanged( (user) => {
        if (!user) {
          observer.error(AppSettings.AUTH_ERRORS.LOGIN_REQUIRED.code);
          unsubscribe();
        } else {
          this.getUser().subscribe((user) => {
            if(user.validated){
              observer.next();
            }else {
              observer.error(AppSettings.AUTH_ERRORS.PROFILE_INCOMPLETE.code);
            }
            unsubscribe();
          }, () => {
            observer.error(AppSettings.AUTH_ERRORS.PROFILE_MISSING.code);
            unsubscribe();
          });
        }
      });
    });
  }

  getUser() {
    return Observable.create(observer => {
      if(this.user){
        observer.next(this.user);
      }else{
        this.afs.collection('people').doc(this.afAuth.auth.currentUser.uid).valueChanges().subscribe( (u:CRSUser) => {
          if(u){
            this.user = u;
            this.appSettings.setUser(this.user);
            observer.next(this.user);
          }else{
            this.setUser();
            observer.error();
          }
        });
      }
    });
  }

  getUserByUid(uid: string): Observable<CRSUser> {
    return Observable.create(observer => {
      if(this.allUserList[uid]){
        observer.next(this.allUserList[uid]);
      }else{
        this.afs.collection('people').doc(uid).valueChanges().subscribe( (u:CRSUser) => {
          if(u){
            this.allUserList[u.uid] = u;
            observer.next(u);
          }else{
            observer.error();
          }
        });
      }
    });
  }

  setUser (){
    this.user = new CRSUser();
    this.user.uid = this.afAuth.auth.currentUser.uid;
    this.user.email = this.afAuth.auth.currentUser.email;
    this.user.email = this.afAuth.auth.currentUser.email;
    this.user.teams = [];
    this.appSettings.setUser(this.user);
  }

  postLogout() {
    this.user = null;
  }

  login(email,password) {
    return Observable.create(observer => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password).then((user) => {
        this.getUser().subscribe((user) => {
          if(user.validated){
            observer.next();
          }else {
            observer.error(AppSettings.AUTH_ERRORS.PROFILE_INCOMPLETE.code);
          }
        }, err => {
          observer.error(AppSettings.AUTH_ERRORS.PROFILE_MISSING.code);
        });
      }).catch((error) => {
        this.messagingService.toast(error.message,true);
        observer.error(error);
      });
    });
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  checkInvitation(code){
    return Observable.create(observer => {
      this.afs.collection('invitations').doc(code).valueChanges().subscribe( (inv:any) => {
        if(inv){
          this.user = new CRSUser();
          this.user.fillFromInvitation(code, inv.firstName, inv.lastName, inv.email);
          observer.next(this.user);
        }else {
          this.messagingService.toast("Invalid Invitation Code. Try Again.",false);
          observer.error();
        }
      });
    });
  }

  finalizeRegistration(password, displayName){
    return Observable.create(observer => {
      this.afAuth.auth.createUserWithEmailAndPassword(this.user.email, password).then((newUser) => {
        this.user.uid = newUser.uid;
        newUser.updateProfile({displayName:displayName}).then(
          (result) => {
            this.appSettings.setUser(this.user);
            observer.next(true);
          }
        );
      }).catch((error) => {
        this.messagingService.toast(error.message,true);
        observer.error();
      });
    });
  }

  updateUser(user: CRSUser, passwordChange: PasswordChange) {
    return Observable.create(observer => {
      user.validated = true;
      this.user.fullName = this.user.firstName + ' ' + this.user.lastName;
      this.afs.collection<CRSUser>('people').doc(user.uid).set(Object.assign({},user)).then(() => {
          this.user = user;
          if(this.user.teams){
            let teamSub = this.afs.collection('teams').valueChanges().subscribe( (allTeams:CRSTeam[]) => {
              teamSub.unsubscribe();
              allTeams.forEach( (currentTeam:CRSTeam) => {
                if( this.user.teams && this.user.teams.find( item => item.code === currentTeam.code) ) {
                  //User IS on this team
                  if(!currentTeam.members){
                    currentTeam.members = {};
                  }
                  if(!currentTeam.members[this.user.uid]){
                    //User is missing, add them
                    currentTeam.members[this.user.uid] = {'name': this.user.fullName, 'uid': this.user.uid, 'wfh': this.user.wfh};
                    this.afs.collection('teams').doc(currentTeam.code).set(currentTeam);
                  }else{
                    console.log('user is already on this team');
                  }
                } else {
                  //User is NOT on this team
                  if(currentTeam.members && currentTeam.members[this.user.uid]){
                    //User is here and needs to be removed
                    delete currentTeam.members[this.user.uid];
                    if(currentTeam.members === {}){
                      delete currentTeam.members;
                    }
                    this.afs.collection('teams').doc(currentTeam.code).set(currentTeam);
                  }
                }

              })
              observer.next(this.user);
            });
          }
        }
      );
    });
  }
}
