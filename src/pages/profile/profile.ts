import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {TeamsProvider} from "../../providers/teams/teams";
import {CRSTeam} from "../../models/CRSTeam";
import {LoginAndRegistrationProvider} from "../../providers/login-and-registration/login-and-registration";
import {Observable} from "rxjs/Observable";
import {CRSUser} from "../../models/CRSUser";
import {NgForm} from "@angular/forms";
import {HomePage} from "../home/home";

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

  constructor(private lrService: LoginAndRegistrationProvider, private teamsService: TeamsProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

  ngOnInit() {
    this.lrService.getUser().subscribe((user) => {
      this.user = user;
    });
    this.teams = this.teamsService.loadTeams();
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
    let idx: number = this.user.teams.indexOf(team);
    return (idx !== -1);
  }

  updateProfile() {
    this.lrService.updateUser().subscribe((user) => {
      this.navCtrl.push(HomePage);
    });
  }
}
