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
      this.lrService.getUser().subscribe( (u:CRSUser) => {
        let userTeams = u.teams;
        userTeams.forEach( (team: any) => {
          let teamsRef = this.afs.collection('teams').doc(team.code);
          teamsRef.valueChanges().subscribe( (t: CRSTeam) => {
            team.members = [];
            for(let key in t.members){
              team.members.push( t.members[key] );
            }
            observer.next(userTeams);
          })
        })
      });
    });
  }

}
