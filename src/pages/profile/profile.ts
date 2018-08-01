import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { CRSTeam } from "../../models/CRSTeam";
import { CRSUser } from "../../models/CRSUser";
import { AppSettings } from "../../providers/app-settings/app-settings";
import { LoginAndRegistrationProvider } from "../../providers/login-and-registration/login-and-registration";
import { TeamsProvider } from "../../providers/teams/teams";
import { HomePage } from "../home/home";
import { LoginPage } from "../login/login";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit, OnDestroy{

  user: CRSUser;
  teams_sub: Subscription;
  teams: Observable<CRSTeam[]>;


  constructor(private lrService: LoginAndRegistrationProvider, private appSettings: AppSettings, private teamsService: TeamsProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit() {
    this.user = this.appSettings.getUser();
    this.teams_sub = this.teamsService.loadTeams().subscribe( (teams) => {
      this.teams = teams;
    });
  }

  ngOnDestroy() {
    this.teams_sub.unsubscribe();
  }

  onTeamChange(team: CRSTeam) {
    let found: boolean;
    if ( this.user.teams ){
      found = ( this.user.teams[team.code] !== undefined );
    }else{
      this.user.teams = {};
      found = false;
    }

    if(!found){
      this.user.teams[team.code] = team.name;
    }else {
      delete this.user.teams[team.code];
    }
  }

  checkTeamSelection(team: CRSTeam) {
    if(!this.user.teams){
      return false;
    }

    const found = ( this.user.teams[team.code] !== undefined );
    return found;
  }

  updateProfile() {
    this.lrService.updateUser().subscribe((user) => {
      this.navCtrl.push(HomePage);
    });
  }

  logout() {
    this.lrService.logout().then( (result) => {
      this.navCtrl.setRoot(LoginPage);
    });
  }
}
