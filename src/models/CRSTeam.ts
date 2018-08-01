/**
 * Created by robpassante on 1/26/18.
 */
export class CRSTeam{

  public code: string;
  public name: string;
  public members: Array<any>[]

  constructor(code:string,name:string,members:Array<any>){
    this.code = code;
    this.name = name;
  }

}
