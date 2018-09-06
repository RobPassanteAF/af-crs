import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CubiclesProvider } from '../../providers/cubicles/cubicles';
import { TeamsProvider } from '../../providers/teams/teams';
import { ReservePage } from '../reserve/reserve';
import { CRSCubicle } from "../../models/CRSCubicle";
import { Observable } from "rxjs/Observable";
import { CRSCubeInfo } from '../../models/CRSCubeInfo';
import { AppSettings } from '../../providers/app-settings/app-settings';
import { CRSUser } from '../../models/CRSUser';
import { ProfilePage } from '../profile/profile';
import { MessagingProvider } from '../../providers/messaging/messaging';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  cubeInfo: CRSCubeInfo;
  myTeamsAndTeammates;
  cubicles: Observable<CRSCubicle[]>;
  userTeams;
  emptyCubeCount:number;

  constructor(public navCtrl: NavController, private cubiclesService: CubiclesProvider, private teamsService: TeamsProvider, private appSettings: AppSettings, private msgService: MessagingProvider) {
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
            this.cubiclesService.releaseCubicle(cubicle.cubeId);
          });
          console.log('setting date as now -> ' + new Date());
          this.cubiclesService.setLastReleaseAllDate(new Date());
        }
      });
    });
  }

  selectLocation(location: string) {
    if ( location === 'HOME' ) {
      if(this.appSettings.getUser().cubicle) {
        this.cubiclesService.releaseCubicle(this.appSettings.getUser().cubicle, true);
      }
    } else {
      this.navCtrl.push(ReservePage);
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
    this.navCtrl.push(ReservePage,{"locate":{"uid":teammate.uid,"name":teammate.name}});
  }

}
