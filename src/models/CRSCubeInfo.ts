export class CRSCubeInfo{

  public totalCubes: number;
  public lastReleaseAllDate: Date;

  constructor( lastReleaseAllDate=null, totalCubes=null ){
    this.lastReleaseAllDate = lastReleaseAllDate;
    this.totalCubes = totalCubes;
  }

}
