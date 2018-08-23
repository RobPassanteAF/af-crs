import { Injectable } from '@angular/core';
import { CRSTeam } from '../../models/CRSTeam';
import { CRSUser } from '../../models/CRSUser';
import { LoginAndRegistrationProvider } from '../login-and-registration/login-and-registration';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
/*
  Generated class for the TeamsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TeamsProvider {

  myTeamsAndTeammates: Array<any> = [];

  constructor(private afs: AngularFirestore, private lrService: LoginAndRegistrationProvider) {

  }

  loadTeams() {
    return this.afs.collection<CRSTeam>('teams').valueChanges();
  }

  myTeamMates(): Observable<any> {
    return Observable.create(observer => {
      this.lrService.getUser().subscribe( (user:CRSUser) => {
        const uid = user.uid;
        let userTeams;
        let userTeamRef = this.afs.collection('/people/'+uid+'/teams');
        userTeamRef.valueChanges().subscribe( (teams) => {
          userTeams = teams;
          userTeams.forEach( (team) => {
            console.log(team);
            let teamMembersRef = this.afs.collection('/teams/'+team.code+'/members');
            teamMembersRef.valueChanges().subscribe( (value) => {
              team.members = value;
              observer.next(userTeams);
            })
          });
        })
      });
    });
  }

}
