import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CubeSvg } from '../../shared/cube-svg/cube-svg';
import { ReservePage } from './reserve';

@NgModule({
  declarations: [
    ReservePage,
    CubeSvg
  ],
  imports: [
    IonicPageModule.forChild(ReservePage),
  ],
})
export class ReservePageModule {}
