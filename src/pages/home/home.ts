import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { CubiclesProvider } from '../../providers/cubicles/cubicles';
import { TeamsProvider } from '../../providers/teams/teams';
import { CRSCubicle } from "../../models/CRSCubicle";
import { Observable } from "rxjs/Observable";
import { CRSCubeInfo } from '../../models/CRSCubeInfo';
import { AppSettings } from '../../providers/app-settings/app-settings';
import { CRSUser } from '../../models/CRSUser';
import { ProfilePage } from '../profile/profile';
import { MessagingProvider } from '../../providers/messaging/messaging';
import { LocateCube } from '../../models/LocateCube';
import { LoginAndRegistrationProvider } from '../../providers/login-and-registration/login-and-registration';
import { PhonePipe } from '../../pipes/format-phone';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ PhonePipe ]
})
export class HomePage {
  cubeInfo: CRSCubeInfo;
  myTeamsAndTeammates;
  cubicles: Observable<CRSCubicle[]>;
  userTeams;
  emptyCubeCount:number;

  constructor(public navCtrl: NavController, private cubiclesService: CubiclesProvider, private teamsService: TeamsProvider, private appSettings: AppSettings, private msgService: MessagingProvider, private lrs: LoginAndRegistrationProvider, public alertCtrl: AlertController, private phonePipe: PhonePipe, private callNumber: CallNumber, public plt: Platform) {
    this.cubiclesService.getCubeInfo().subscribe( (info: CRSCubeInfo)=> {
      this.cubiclesService.setCubeInfo(info);
      this.cubeInfo = info;
    });

    this.releaseAllCubicles();    // temporary workaround to release all cubicles
    this.getMyTeammates();
    this.checkProfile();
    this.cubiclesService.getEmptyCubicles().subscribe((emptyCubes)=>{
     this.emptyCubeCount = emptyCubes.length;
    })
  }


  releaseAllCubicles() {
    this.cubiclesService.getAllCubibles().subscribe(cubicles => {
      this.cubiclesService.getLastReleaseAllDate().subscribe( (cubeInfo: CRSCubeInfo) => {
        console.log(cubeInfo.lastReleaseAllDate);
        var scheduledRelease = new Date();
        scheduledRelease.setHours(5,0,0,0);
        if(new Date(cubeInfo.lastReleaseAllDate).valueOf() < scheduledRelease.valueOf()) {
          cubicles.filter( cubicle => (cubicle.person != null && !cubicle.permanent)).forEach(cubicle => {
            console.log('About to automatically release ' + cubicle.cubeId);
            this.cubiclesService.releaseCubicle(cubicle.cubeId, null);
          });
          console.log('setting date as now -> ' + new Date());
          this.cubiclesService.setLastReleaseAllDate(new Date());
        }
      });
    });
  }

  selectLocation(location: string) {
    if ( location === 'HOME' ) {
      let user: CRSUser = this.appSettings.getUser();
      if(user.cubicle) {
        this.cubiclesService.releaseCubicle(user.cubicle, true);
      }else{
        user.wfh = true;
        this.lrs.userIsWfh();
      }
      this.msgService.toast('You have been checked-in as working from home.');
    } else {
      this.navCtrl.parent.select(1);
    }
  }

  checkProfile(){
    console.log('checking profile for valid state');
    let user: CRSUser = this.appSettings.getUser();
    if(!user.validated){
      this.navCtrl.push(ProfilePage).then( () => {
        this.msgService.toast('Please validate your profile');
      });
    }
  }

  getMyTeammates():void {
    this.teamsService.myTeamMates().subscribe( (teammates) => {
      this.myTeamsAndTeammates = teammates;
    });
  }

  locateTeammate(teammate){
    let locate_sub = this.lrs.getUserByUid(teammate.uid).subscribe(( u: CRSUser ) => {
      if(u.cubicle){
        const c: LocateCube = new LocateCube( teammate.uid, teammate.name );
        this.cubiclesService.setCubeToLocate(c);
        this.navCtrl.parent.select(1);
      }else{
        let alertMsg;
        let alertButtons = [
          {
            text: 'Dismiss',
            handler: () => {
              locate_sub.unsubscribe();
            }
          }
        ]

        if( this.plt.is('cordova') ) {
          alertButtons.push({
            text: 'Call',
            handler: () => {
              console.log('Call ' + u.cell);
              locate_sub.unsubscribe();
              this.callNumber.callNumber(u.cell, true)
                .then(res => console.log('Launched dialer!', res))
                .catch(err => console.log('Error launching dialer', err));
            }
          })
        }

        let status;

        if(u.wfh){
          status = ' is WFH today';
        }else{
          status = ' has not checked in yet.';
        }

        alertMsg = `<p>` + teammate.name + status +
            `</p>
            <p><b>Contact Information:</b></p>
            <p>E-Mail: <a href="mailto:` + u.email + `">` + u.email + `</a></p>`;
        if(u.cell){
          alertMsg = alertMsg + `<p>Phone: ` + this.phonePipe.transform({ country: 'US', phone: u.cell }, 'International') + `</p>`;
        }


        const locateAlert = this.alertCtrl.create({
          title: 'Locate Teammate',
          message: alertMsg,
          buttons: alertButtons
        });
        locateAlert.present();
      }
    })
  }

}
