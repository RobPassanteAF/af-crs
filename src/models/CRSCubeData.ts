/**
 * Created by robpassante on 04/04/18.
 */
import {CRSCubeText} from "./CRSCubeText";

export class CRSCubeData{

  public xPosition: number;
  public yPosition: number;
  public width: number;
  public height: number;
  public permanent: boolean;
  public cubeText: Array<CRSCubeText>;

  constructor(xPosition=null,yPosition=null,width=null,height=null,permanent=false,cubeText=null){
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.width = width;
    this.height = height;
    this.permanent = permanent;
    this.cubeText = cubeText;
  }

}
