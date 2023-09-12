import {Component} from '@angular/core';
import {
  AlertController,
  IonicPage, LoadingController, MenuController, NavController, NavParams, ToastController
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
    // Set up the loader
    let loader = this.loaderCtrl.create();
    loader.present();
    //
    // Setup the user and go to the tree page if it exists
    try {
      // Get the tree's id from the URL
      this.objectId = location.href.split("?")[1].split("=")[1];
      // If there is and ID for the tree get the tree
      if (!!this.objectId) {
        // Get the tree and set the session storage, go to the details of the tree
        // if something goes wrong show the error message
        this.alberoProvider.findByIdPianta(this.objectId).subscribe((albero: Albero) => {
          // Setup the session storage
          sessionStorage.setItem('albero', JSON.stringify(albero));
          // Navigate to the next page
          this.navCtrl.setRoot("AlberoDetailsPage", {albero: albero});
        }, err => {
          if(err.status === 404) {
            // To let user create a new tree he must be logged in
            let isAnonymous = this.authProvider.isAnonimusUser();
            if(isAnonymous) {
              const alert = this.alertCtrl.create({
                message: "Codice non trovato! Per creare un nuovo albero è necessario autenticarsi.",
                buttons: [{text: "ok"}]
              });
              alert.present();
            } else {
            // sessionStorage.removeItem('albero');
            sessionStorage.setItem('newIdPianta', JSON.stringify(this.objectId));
            this.navCtrl.setRoot("FindPlantPage");
            this.navCtrl.push("AlberoDetailsPage", {newIdPianta: this.objectId});
          }
          } else {
            localStorage.setItem('objectId', this.objectId);
            const alert = this.alertCtrl.create({
              message: "Il codice rilevato non è stato trovato nei nostri archivi",
              buttons: [{text: "ok"}]
            });
            alert.present();
          }
        })
      }
    } catch (e) {}
    //
    // Stop the loader
    loader.dismiss();
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
