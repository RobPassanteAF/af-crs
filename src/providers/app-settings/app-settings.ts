import { Injectable } from '@angular/core';
import {CRSUser} from "../../models/CRSUser";

/*
  Generated class for the AppSettings provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AppSettings {

  user: CRSUser;

  public static AUTH_ERRORS = {
    "LOGIN_REQUIRED":     {code: "LOGIN_REQUIRED", msg: "You must login before you can continue"},
    "PROFILE_INCOMPLETE": {code: "PROFILE_INCOMPLETE", msg: "Your profile is incomplete and must updated before you can continue"},
    "PROFILE_MISSING":    {code: "PROFILE_MISSING", msg: "You must create your profile before you can continue"}
  };

  getUser():CRSUser {
    return this.user;
  }

  setUser(user:CRSUser):void {
    this.user = user as CRSUser;
  }

  constructor() {

  }

}
