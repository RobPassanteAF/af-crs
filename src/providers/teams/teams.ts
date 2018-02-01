import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {CRSTeam} from "../../models/CRSTeam";

/*
  Generated class for the TeamsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TeamsProvider {
  teams: CRSTeam[];

  constructor(private afDatabase: AngularFireDatabase) {

  }

  loadTeams() {
    return Observable.create(observer => {
      if(this.teams){
        observer.next(this.teams);
      }else{
        this.afDatabase.database.ref().child('teams').once('value').then((snapshot) => {
          this.teams = snapshot.val();
          observer.next(this.teams);
        });
      }
    });
  }

}
