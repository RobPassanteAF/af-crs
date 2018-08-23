export class CRSCubeCounts{

  public emptyCubes: number;
  public totalCubes: number;
  public lastReleaseAllDate: Date;

  constructor(emptyCubes=null,totalCubes=null){
    this.emptyCubes = emptyCubes;
    this.totalCubes = totalCubes;
  }

}
