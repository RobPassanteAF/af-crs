import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {CRSTeam} from "../../models/CRSTeam";

/*
  Generated class for the TeamsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TeamsProvider {

  constructor(private afDatabase: AngularFireDatabase) {

  }

  loadTeams() {
    return this.afDatabase.list<CRSTeam>('teams').valueChanges();
  }

}
