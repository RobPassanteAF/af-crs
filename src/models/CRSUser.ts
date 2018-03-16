import {CRSCubicle} from "./CRSCubicle";
import {CRSTeam} from "./CRSTeam";
/**
 * Created by robpassante on 1/26/18.
 */
export class CRSUser {
  public invitationCode: string;
  public uid: string;
  public name: string;
  public email: string;
  public cell: string;
  public teams: Array<CRSTeam>;
  public cubicle: CRSCubicle;
  public validated: boolean = false;
  public currentCubicle: number;

  constructor(){}

  fillFromInvitation(code: string, name: string, email: string) {
    this.invitationCode = code;
    this.name = name;
    this.email = email;
  }
}
