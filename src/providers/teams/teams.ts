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
  teams: Observable<CRSTeam[]>;

  constructor(private afDatabase: AngularFireDatabase) {
    this.teams = this.afDatabase.list('teams').valueChanges();
  }

  loadTeams() {
    return this.teams;
  }

}
