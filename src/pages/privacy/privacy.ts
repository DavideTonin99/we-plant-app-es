import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {PrivacyProvider} from "../../providers/privacy/privacy";
import {AuthProvider} from "../../providers/auth/auth";
import {JhUserModel} from "../../model/jhUser-model";
import {UserModel} from "../../model/user";

/**
 * Generated class for the PrivacyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-privacy',
  templateUrl: 'privacy.html',
})
export class PrivacyPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public privacyProvider: PrivacyProvider,
              public authProvider: AuthProvider,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
  }

  revoke() {
    this.alertCtrl.create({
      message: "Una volta revocato il consenso non sarà più possibile utilizzare l'app. Proseguire?",
      buttons: [
        {
          text: "Si, revoca", handler: () => {
            let loading = this.loadingCtrl.create();
            loading.present();
            this.privacyProvider.save({privacy: false, time: null, id: null, userId: null}).subscribe(res => {
              this.authProvider.deactivateAccount().subscribe(res => {
                loading.dismiss();
                this.authProvider.logout();
                this.navCtrl.setRoot("IntroPage");
              }, err => {
                loading.dismiss();
                this.toastCtrl.create({
                  message: "Errore durante la revoca del consenso. Si prega di riprovare.",
                  closeButtonText: "chiudi",
                  showCloseButton: true
                }).present();
              })
            }, err => {
              loading.dismiss();
              this.toastCtrl.create({
                message: "Errore durante la revoca del consenso. Si prega di riprovare.",
                closeButtonText: "chiudi",
                showCloseButton: true
              }).present();
            })
          }
        }, {
          text: "No, non revocare"
        }]
    }).present();
  }
}
