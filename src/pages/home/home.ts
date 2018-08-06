import { Component, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import {MessagingProvider} from "../../providers/messaging/messaging";
import { CubiclesProvider } from '../../providers/cubicles/cubicles';
import { TeamsProvider } from '../../providers/teams/teams';
import { ReservePage } from '../reserve/reserve';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnDestroy {
  emptyCubicles: number;
  myTeamsAndTeammates;

  constructor(public navCtrl: NavController,  private messagingService: MessagingProvider, private cubiclesService: CubiclesProvider, private     teamsService: TeamsProvider) {
    this.cubiclesService.getEmptyCubicles().subscribe( (emptyCubes)=> {
      this.cubiclesService.setEmptyCubicles(emptyCubes);
      this.emptyCubicles = emptyCubes;
    });
    this.getMyTeammates();
  }

  ngOnDestroy(){
    console.log('destroying home');
  }

  selectLocation(location: string) {
    this.messagingService.toast("You are at " + location);
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
