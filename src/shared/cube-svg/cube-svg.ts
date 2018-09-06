import { Component, Input, OnInit } from '@angular/core';
import { CRSCubeText } from '../../models/CRSCubeText';
import { LoginAndRegistrationProvider } from '../../providers/login-and-registration/login-and-registration';
import { AppSettings } from '../../providers/app-settings/app-settings';
import { CRSCubicle } from '../../models/CRSCubicle';
import { CRSUser } from '../../models/CRSUser';

@Component({
  selector: '[cube-svg]',
  templateUrl: 'cube-svg.html',
})
export class CubeSvg implements OnInit {

  @Input() cubeData: CRSCubicle;
  @Input() locate: string;
  isRoom: boolean;
  isOpen: boolean;
  isLocked: boolean;
  loggedInUser: CRSUser;
  cubeText: Array<CRSCubeText> = [];

  constructor( private lrs: LoginAndRegistrationProvider, private appSettings: AppSettings ) {

  }

  ngOnInit() {
    if(this.cubeData.person){
      this.isRoom = false;
      this.isOpen = false;
      this.isLocked = true;
      this.getCubeText(this.cubeData.person);
    }else{
      if(!this.cubeData.cubeText){
        this.cubeData.personName = null;
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
    this.loggedInUser = this.appSettings.getUser();
  }

  getCubeText( uid: string ): void {
    this.lrs.getUserByUid(uid).subscribe( (user) => {
      this.cubeData.personName = user.firstName + ' ' + user.lastName;
      this.createCubeText(50,50,user.firstName);
      this.createCubeText(50,75,user.lastName);
    })
  }

  createCubeText(x:number, y:number, text:string){
    const ct: CRSCubeText = new CRSCubeText(x,y,text);
    this.cubeText.push(ct);
  }
}
