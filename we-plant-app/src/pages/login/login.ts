import {Component} from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  MenuController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthProvider} from '../../providers/auth/auth';
import {TranslateService} from '@ngx-translate/core';
import {PouchdbProvider} from '../../providers/pouchdb/pouchdb';
import {ConfigProvider} from "../../providers/config/config";
import {UserModel} from "../../model/user";
import {PrivacyProvider} from "../../providers/privacy/privacy";
import {JhUserModel} from "../../model/jhUser-model";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  submitAttempt = false;
  loginForm;
  user

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public authProvider: AuthProvider,
              public toastCtrl: ToastController,
              public translateService: TranslateService,
              private pouchdbProvider: PouchdbProvider,
              private configProvider: ConfigProvider,
              private loadingCtrl: LoadingController,
              private menu: MenuController,
              private privacyProvider: PrivacyProvider,
              private alertCtrl: AlertController) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });
    this.pouchdbProvider.fetch('user').subscribe(res => {
      this.loginForm.controls['email'].setValue((<any>res).data.email);
      this.loginForm.controls['password'].setValue((<any>res).data.password);
    }, error => {
      console.log('error')
    })

  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  recoverPasswor() {
    this.navCtrl.push('RecoverPasswordPage');
  }

  signUp() {
    this.navCtrl.push('SignUpPage');
  }

  login() {

    this.submitAttempt = true;
    if (this.loginForm.valid) {
      let user = new UserModel(this.loginForm.controls.email.value, this.loginForm.controls.password.value, "");

      const loader = this.loadingCtrl.create();
      loader.present();
      this.authProvider.authenticate(user.email, user.password)
        .subscribe(result => {
          user.userToken = `Bearer ${(<any>result).id_token}`;
          this.configProvider.userToken = user.userToken;
          localStorage.setItem("user-token", this.configProvider.userToken);
          this.authProvider.account().subscribe((jhUserModel: JhUserModel) => {
            loader.dismiss();
            localStorage.removeItem('user');//remove revious anonymous user
            user.id = jhUserModel.id;
            this.pouchdbProvider.create('user', user);
            let toast = this.toastCtrl.create({
              message: this.translateService.instant('LOGIN.SUCCESS'),
              duration: 3000,
              position: 'bottom',
              showCloseButton: true,
              closeButtonText: "Ok"
            });
            toast.present();
            toast.onDidDismiss(() => {
              this.navCtrl.setRoot("FindPlantPage");
            });
            this.authProvider.isLoggedIn = true;
          }, err => {
            this.onLoginError(err);
            loader.dismiss();
          })

        }, error => {
          this.onLoginError(error);
          loader.dismiss();
        });

      console.log('valid')
    } else {
      console.log('not valid');
    }
  }


  onLoginError(error) {
    console.log(error);
    this.authProvider.isLoggedIn = false;
    if (!!error.error && error.error.detail == "Bad credentials") {
      let toast = this.toastCtrl.create({
        message: this.translateService.instant('LOGIN.ERROR'),
        duration: 4000,
        position: 'bottom'
      });
      toast.present();
    } else if (!!error.error && error.error.detail.indexOf("was not activated") >= 0) {
      let toast = this.toastCtrl.create({
        message: "Utente non attivo oppure consenso revocato",
        duration: 4000,
        position: 'bottom'
      });
      toast.present();
    } else {
      let toast = this.toastCtrl.create({
        message: "Errore imprevisto durante l'autenticazione",
        duration: 4000,
        position: 'bottom'
      });
      toast.present()
    }

  }

  renewPrivacy() {
    this.alertCtrl.create({
      message: 'Inserisci l\'indirizzo email di registrazione per prestare nuovamente il consenso al trattamento dei dati personali',
      inputs: [{label: 'email', name: 'email', placeholder: 'Indirizzo email di registrazione'}],
      buttons: [{
        text: 'Presta il consenso', handler: (data) => {
          let loader = this.loadingCtrl.create();
          loader.present();
          this.privacyProvider.consentPrivacyAndActiveUser(data.email).subscribe(res => {
            loader.dismiss();
            this.toastCtrl.create({
              showCloseButton: true,
              message: 'Consenso salvato con successo',
              duration: 3000
            }).present();

          }, err => {
            loader.dismiss();
            if (err.error.errorKey == 'usernotfound') {
              this.toastCtrl.create({
                showCloseButton: true,
                message: 'Indirizzo email non registrato',
                duration: 3000
              }).present();
            } else {
              this.toastCtrl.create({
                showCloseButton: true,
                message: 'Non è stato possibile salvare il consenso',
                duration: 3000
              }).present();
            }
          })
        }
      }, {text: 'Annulla'}]
    }).present();
  }
}
