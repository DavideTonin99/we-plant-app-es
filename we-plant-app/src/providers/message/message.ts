import {Injectable} from '@angular/core';
import {ToastController} from "ionic-angular";

/*
  Generated class for the MessageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageProvider {

  constructor(public toastCtrl: ToastController) {
  }

  createToast(message: string, duration: number, position: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'position',
      showCloseButton: true,
      closeButtonText: "ok"
    });
    toast.present();
    return toast;
  }

  createDefaultToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "ok"
    })
    toast.present();
    return toast;
  }
}
