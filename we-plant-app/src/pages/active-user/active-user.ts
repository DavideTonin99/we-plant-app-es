import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {FormBuilder, Validators} from "@angular/forms";

/**
 * Generated class for the ActiveUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-active-user',
  templateUrl: 'active-user.html',
})
export class ActiveUserPage {
  activeForm;
  submitAttempt: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authProvider: AuthProvider,
              public toastCtrl: ToastController,
              formBuilder: FormBuilder) {
    this.activeForm = formBuilder.group({
      code: ['', Validators.compose([Validators.required])],
    });
  }

  ionViewDidLoad() {
  }

  activeUser() {
    this.submitAttempt = true;
    if (this.activeForm.valid) {
      this.authProvider.activeUser(this.activeForm.controls.code.value)
        .subscribe(res => {
          let toast = this.toastCtrl.create({
            showCloseButton: true,
            message: "Utente attivato con successo, ora puoi accedere con le tue credenziali.",
            duration: 3000
          });
          toast.present();
          toast.onDidDismiss(() => {
            this.navCtrl.setRoot("LoginPage");
          });
        }, res => {
          this.toastCtrl.create({
            showCloseButton: true,
            message: "Il codice inserito non è valido oppure è già stato utilizzato.",
            duration: 3000
          }).present();
        })
    }
  }

}
