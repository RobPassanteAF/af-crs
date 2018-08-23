import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CubiclesProvider } from '../../providers/cubicles/cubicles';
import { TeamsProvider } from '../../providers/teams/teams';
import { ReservePage } from '../reserve/reserve';
import { CRSCubicle } from "../../models/CRSCubicle";
import { Observable } from "rxjs/Observable";
import { CRSCubeCounts } from '../../models/CRSCubeCounts';
import { AppSettings } from '../../providers/app-settings/app-settings';
import { CRSUser } from '../../models/CRSUser';
import { ProfilePage } from '../profile/profile';
import { MessagingProvider } from '../../providers/messaging/messaging';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  cubeCounts: CRSCubeCounts;
  myTeamsAndTeammates;
  cubicles: Observable<CRSCubicle[]>;
  userTeams;
  testList

  constructor(public navCtrl: NavController, private cubiclesService: CubiclesProvider, private teamsService: TeamsProvider, private appSettings: AppSettings, private msgService: MessagingProvider) {
    this.cubiclesService.getCubeCounts().subscribe( (counts: CRSCubeCounts)=> {
      this.cubiclesService.setCubeCounts(counts);
      this.cubeCounts = counts;
    });

    this.releaseAllCubicles();    // temporary workaround to release all cubicles
    this.getMyTeammates();
    this.checkProfile();
  }


  releaseAllCubicles() {
    this.cubiclesService.getAllCubibles().subscribe(cubicles => {
      this.cubiclesService.getLastReleaseAllDate().subscribe( (cubeInfo: CRSCubeCounts)=> {
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
    this.navCtrl.push(ReservePage,{"locate":{"uid":teammate.key,"name":teammate.val}});
  }

}
