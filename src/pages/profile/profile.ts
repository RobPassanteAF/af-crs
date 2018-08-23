import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CRSTeam } from "../../models/CRSTeam";
import { CRSUser } from "../../models/CRSUser";
import { AppSettings } from "../../providers/app-settings/app-settings";
import { LoginAndRegistrationProvider } from "../../providers/login-and-registration/login-and-registration";
import { TeamsProvider } from "../../providers/teams/teams";
import { MessagingProvider } from '../../providers/messaging/messaging';
import { PasswordChange } from '../../models/PasswordChange';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit {

  passwordChange:PasswordChange = new PasswordChange();
  user: CRSUser;
  teams: CRSTeam[];


  constructor(private lrService: LoginAndRegistrationProvider, private appSettings: AppSettings, private teamsService: TeamsProvider, public navCtrl: NavController, public navParams: NavParams,  private messagingService: MessagingProvider) {
  }

  ngOnInit() {
    this.user = this.appSettings.getUser();
    this.teamsService.loadTeams().subscribe( (teams) => {
      this.teams = teams;
    });
  }

  ionViewCanLeave(): boolean {
    return this.user.validated;
  }

  onTeamChange(team: CRSTeam) {
    let idx: number = -1;
    if ( this.user.teams ){
      idx = this.user.teams.findIndex(item => item.code === team.code);
    }else{
      this.user.teams = [];
    }

    if(idx === -1){
      let t = team;
      delete t.members;
      this.user.teams.push(t);
    }else {
      this.user.teams.splice(idx,1);
      if(this.user.teams.length === 0) {
        delete this.user.teams;
      }
    }
  }

  checkTeamSelection(team: CRSTeam) {
    if(!this.user.teams){
      return false;
    }

    return ( this.user.teams.findIndex(item => item.code === team.code) !== -1 );
  }

  updateProfile() {
    let valid: boolean = false;
    if(this.passwordChange.showPasswordChange){
      valid = ( this.passwordChange.newPassword === this.passwordChange.confirmValue );
      if(!valid){
        this.messagingService.toast("Passwords must match");
      }
    }else{
      valid = true;
    }
    if(valid){
      this.lrService.updateUser(this.user, this.passwordChange).subscribe((user) => {
        this.messagingService.toast("Profile Update Successful");
      });
    }
  }

  logout() {
    this.lrService.logout().then( (result) => {
      this.navCtrl.setRoot(LoginPage).then( (result) => {
        this.user = null;
        this.lrService.postLogout();
      });
    });;
  }
}
