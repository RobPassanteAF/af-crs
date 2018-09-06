import { CRSTeam } from "./CRSTeam";

/**
 * Created by robpassante on 1/26/18.
 */
export class CRSUser {
  public invitationCode: string;
  public uid: string;
  public firstName: string;
  public lastName: string;
  public fullName: string;
  public email: string;
  public cell: string;
  public teams: Array<CRSTeam>;
  public cubicle: string;
  public wfh: any = null;
  public validated: boolean = false;

  constructor(){}

  fillFromInvitation(code: string, firstName: string, lastName: string, email: string) {
    this.invitationCode = code;
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = firstName + " " + lastName;
    this.email = email;
  }
}
