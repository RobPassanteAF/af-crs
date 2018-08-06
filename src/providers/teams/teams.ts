import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import { CRSTeam } from '../../models/CRSTeam';
import { CRSUser } from '../../models/CRSUser';
import { LoginAndRegistrationProvider } from '../login-and-registration/login-and-registration';
import { Observable } from 'rxjs/Observable';
/*
  Generated class for the TeamsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TeamsProvider {

  myTeamsAndTeammates: Array<any> = [];

  constructor(private afDatabase: AngularFireDatabase, private lrService: LoginAndRegistrationProvider) {

  }

  loadTeams() {
    return this.afDatabase.list<CRSTeam>('teams').valueChanges();
  }

  myTeamMates(): Observable<any> {
    return Observable.create(observer => {
      this.lrService.getUser().subscribe( (user:CRSUser) => {
        console.log('User: ' + user);
        const currentUser: CRSUser = user;
        this.afDatabase.list<CRSTeam>('teams/').valueChanges().subscribe( (teams) => {
          teams.forEach( (currentTeam: CRSTeam) => {
            //delete currentTeam.members[currentUser.uid]
            if(currentUser.teams[currentTeam.code] && currentTeam.members){
              let t = {
                "teamCode": currentTeam.code,
                "teamName": currentTeam.name,
                "members": currentTeam.members
              }
              this.myTeamsAndTeammates.push(t);
            }
          })
          observer.next(this.myTeamsAndTeammates);
        })
      });
    });
  }



}
