import {Component} from '@angular/core';
import {
  AlertController,
  IonicPage, LoadingController, MenuController, NavController, NavParams, Platform,
  ToastController
} from 'ionic-angular';
import {User} from "../../model/user.model";
import {AuthProvider} from "../../providers/auth/auth";
import {ConfigProvider} from "../../providers/config/config";
import {MessageProvider} from "../../providers/message/message";
import {Albero} from "../../model/albero.model";
import {AlberoProvider} from "../../providers/albero/albero";

declare var navigator: any;

/**
 * Generated class for the IntroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {
  privacyOn;
  privacyOff;
  userCreated;
  objectId;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authProvider: AuthProvider,
              public configProvider: ConfigProvider,
              public toastCtrl: ToastController,
              public loaderCtrl: LoadingController,
              public messageProvider: MessageProvider,
              private menu: MenuController,
              private alberoProvider: AlberoProvider,
              private alertCtrl: AlertController) {
    this.userCreated = !!localStorage.getItem('user');
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({name: 'geolocation'}).then((result) => {
        console.log(result.state === 'granted');
      });
    }


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');
    try {
      this.objectId = location.href.split("?")[1].split("=")[1];

      if (!!this.objectId) {
        let loader = this.loaderCtrl.create();
        loader.present();
        this.alberoProvider.findByIdPianta(this.objectId).subscribe((albero: Albero) => {
          sessionStorage.setItem('albero', JSON.stringify(albero));
          this.navCtrl.setRoot("AlberoDetailsPage", {albero: albero});
          loader.dismiss();
        }, err => {
          loader.dismiss();
          const alert = this.alertCtrl.create({
            message: "Il codice rilevato non è stato trovato nei nostri archivi",
            buttons: [{text: "ok"}]
          });
          alert.present();
        })
      }

    } catch (e) {
    }
    console.log(this.objectId);
  }

  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  signUp() {
    this._signUp();
  }

  _signUp() {
    /*this.navCtrl.setRoot('SignupPage');*/
    let user = localStorage.getItem('user');
    let loader = this.loaderCtrl.create();
    loader.present();
    if (!!user) {
      this.authProvider.login((<User>JSON.parse(user)).username, (<User>JSON.parse(user)).password)
        .subscribe(result => {
          let userToken = `Bearer ${(<any>result).id_token}`;
          this.configProvider.userToken = userToken;
          localStorage.setItem("user-token", userToken);
          loader.dismiss();
          this.navCtrl.setRoot('FindPlantPage')
        }, error2 => {
          loader.dismiss();
          let toast = this.toastCtrl.create({
            message: "Errore durante l'autenticazione, riprova.",
            duration: 3000,
            position: 'top'
          })
          toast.present();
        })
    } else {

      this.authProvider.registerAnonymousUser(!!this.privacyOn).subscribe(user => {
        this.authProvider.login(user.username, user.password).subscribe(result => {
          let userToken = `Bearer ${(<any>result).id_token}`;
          this.configProvider.userToken = userToken;
          localStorage.setItem("user-token", userToken);
          localStorage.setItem('user', JSON.stringify(user))
          loader.dismiss();
          this.navCtrl.setRoot('FindPlantPage');
        }, error2 => {
          loader.dismiss();
          let toast = this.toastCtrl.create({
            message: "Errore durante l'autenticazione, riprova.",
            duration: 3000,
            position: 'top'
          })
          toast.present();
        })

      }, error2 => {
        this.messageProvider.createDefaultToast("Errore durante l'autenticazione. Riprovare.");
        loader.dismiss();
      })
    }
  }

  updatePrivacyOn() {
    this.privacyOn = true;
    this.privacyOff = false;
  }

  updatePrivacyOff() {
    this.privacyOff = true;
    this.privacyOn = false;
  }

  loginOrSignUp() {
    this.navCtrl.push("LoginPage");
    /*    navigator.permissions.query({name: 'geolocation'}).then((result) => {
          if (result.state == 'granted') {
            this.navCtrl.push("LoginPage");
          } else {
            this.toastCtrl.create({
              message: 'Non è possibile proseguire senza fornire l\'autorizzazione alla posizione',
              showCloseButton: true,
              closeButtonText: 'Chiudi',
              duration: 10000
            }).present();
          }
        });*/
  }
}
