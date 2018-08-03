import { Component, Input, OnInit } from '@angular/core';
import { CRSCubeText } from '../../models/CRSCubeText';
import { LoginAndRegistrationProvider } from '../../providers/login-and-registration/login-and-registration';
import { CRSCubicle } from '../../models/CRSCubicle';

@Component({
  selector: '[cube-svg]',
  templateUrl: 'cube-svg.html',
})
export class CubeSvg implements OnInit {

  @Input() cubeData: CRSCubicle;
  isRoom: boolean;
  isOpen: boolean;
  isLocked: boolean;

  cubeText: Array<CRSCubeText> = [];

  constructor( private lrs: LoginAndRegistrationProvider ) {

  }
  ngOnInit() {
    if(this.cubeData.person){
      this.isRoom = false;
      this.isOpen = false;
      this.isLocked = true;
      this.getCubeText(this.cubeData.person);
    }else{
      if(!this.cubeData.cubeText){
        this.isRoom = false;
        this.isLocked = this.cubeData.permanent;
        this.isOpen = (!this.cubeData.permanent);
        this.createCubeText(50,50,(this.cubeData.permanent?'Reserved':'Open Hotel'));
        this.createCubeText(50,75,'Cube');
      }else{
        this.isRoom = true;
        this.isLocked = false;
        this.isOpen = false;
      }
    }
  }

  getCubeText( uid: string ): void {
    this.lrs.getUserByUid(uid).subscribe( (user) => {
      this.createCubeText(50,50,user.firstName);
      this.createCubeText(50,75,user.lastName);
    })
  }

  createCubeText(x:number, y:number, text:string){
    const ct: CRSCubeText = new CRSCubeText(x,y,text);
    this.cubeText.push(ct);
  }
}