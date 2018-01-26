/**
 * Created by robpassante on 1/26/18.
 */
export class CRSUser{
  public invitationCode: string;
  public name: string;
  public email: string;
  public phone: string;

  constructor(){}

  fillFromInvitation(code: string, name: string, email: string) {
    this.invitationCode = code;
    this.name = name;
    this.email = email;
  }
}
