import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {TeamsProvider} from "../../providers/teams/teams";
import {CRSTeam} from "../../models/CRSTeam";
import {Observable} from "rxjs/Observable";
import {CRSUser} from "../../models/CRSUser";
import {HomePage} from "../home/home";
import {AppSettings} from "../../providers/app-settings/app-settings";
import {LoginAndRegistrationProvider} from "../../providers/login-and-registration/login-and-registration";

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
export class ProfilePage implements OnInit{

  user: CRSUser;
  teams: Observable<CRSTeam[]>;

  constructor(private lrService: LoginAndRegistrationProvider, private appSettings: AppSettings, private teamsService: TeamsProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

  ngOnInit() {
    this.user = this.appSettings.getUser();
    this.teamsService.loadTeams().subscribe( (teams) => {
      this.teams = teams;
    });
  }

  onTeamChange(team: CRSTeam) {
    let idx: number = this.user.teams.indexOf(team);
    if(idx === -1){
      this.user.teams.push(team);
    }else {
      this.user.teams.splice(idx,1);
    }
  }

  checkTeamSelection(team: CRSTeam) {
    if(!this.user.teams){
      return false;
    }

    let found = false;
    this.user.teams.forEach( (item) => {
      if(item.code === team.code){
        found = true;
      }
    });
    return found;
  }

  updateProfile() {
    this.lrService.updateUser().subscribe((user) => {
      this.navCtrl.push(HomePage);
    });
  }
}
