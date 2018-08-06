/**
 * Created by robpassante on 1/26/18.
 */
export class CRSTeam{

  public code: string;
  public name: string;
  public members: Object

  constructor(code:string,name:string,members:Object){
    this.code = code;
    this.name = name;
    this.members = members;
  }

}
