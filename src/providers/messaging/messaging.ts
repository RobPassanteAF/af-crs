import { Injectable } from '@angular/core';
import {ToastController} from "ionic-angular";

/*
  Generated class for the MessagingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessagingProvider {

  constructor(private toastCtrl: ToastController) {
    console.log('Hello MessagingProvider Provider');
  }

  toast(message,showCloseButton=false,closeButtonText=null){
    let toastConfig = {
      message: message,
      showCloseButton: showCloseButton,
      closeButtonText: (closeButtonText)?closeButtonText:'Ok',
      duration: null
    };
    if(!showCloseButton){
      toastConfig.duration = 2000;
    }
    const toast = this.toastCtrl.create(toastConfig);
    toast.present();
  }

}
