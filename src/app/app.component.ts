import {Component, ViewChild} from '@angular/core';
import {AlertController, MenuController, Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TranslateService} from "@ngx-translate/core";
import {AlberoDetailsPage} from "../pages/albero-details/albero-details";
import {AuthProvider} from "../providers/auth/auth";
import {PrivacyPage} from "../pages/privacy/privacy";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  @ViewChild(Nav) nav: Nav;
  public alertShown: boolean = false;
  private pageChanging: boolean = false

  constructor(private platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              public menuCtrl: MenuController,
              private translate: TranslateService,
              private authProvider: AuthProvider,
              private alertCtrl: AlertController) {

    translate.setDefaultLang('it');
    translate.use('it');
    platform.ready().then(() => {
      if (document.URL.startsWith('http')) {
        /*               Environment.setEnv({
                          API_KEY_FOR_BROWSER_RELEASE: "AIzaSyCC3gd9rWXp1hJ9sPMMT_dftVuwaxzHQ48",
                          API_KEY_FOR_BROWSER_DEBUG: "AIzaSyCC3gd9rWXp1hJ9sPMMT_dftVuwaxzHQ48"
                        });*/

      }
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleLightContent();
      statusBar.backgroundColorByHexString('#A1AEAD');

      this.rootPage = "IntroPage";
      splashScreen.hide();
      platform.registerBackButtonAction(() => {
        if (this.nav.canGoBack()) {
          this.nav.pop();
        }
        else if (!this.nav.canGoBack() && this.alertShown == false) {
          this.presentConfirm();
        }
      }, 0)

    });
  }

  explore() {
    /*    console.log(this.nav.getActive().name);
        if('MapPage' != this.nav.getActive().name){
          this.pageChanging = true;
          this.nav.push("MapPage");
          this.menuCtrl.close().then(() => {
            this.pageChanging = false;
          })
        }else {
          this.menuCtrl.close();
        }*/
    this.menuCtrl.close();

  }

  diagnostics() {
    this.pageChanging = true;
    this.nav.push("DiagnosticsPage");
    this.menuCtrl.close().then(() => {
      this.pageChanging = false;
    })
  }

  findAlbero() {
    this.pageChanging = true;
    this.nav.push("FindPlantPage");
    this.menuCtrl.close().then(() => {
      this.pageChanging = false;
    })

  }

  newAlbero() {
    this.pageChanging = true;
    //sessionStorage.setItem('albero', JSON.stringify(albero));
    sessionStorage.removeItem('albero');
    this.nav.push("AlberoDetailsPage");
    this.menuCtrl.close().then(() => {
      this.pageChanging = false;
    })

  }

  privacy() {
    this.pageChanging = true;
    this.nav.push("PrivacyPage");
    this.menuCtrl.close().then(() => {
      this.pageChanging = false;
    })
  }


  credits() {
    this.pageChanging = true;
    this.nav.push("CreditsPage");
    this.menuCtrl.close().then(() => {
      this.pageChanging = false;
    })
  }

  anonimusLogout() {
    this.pageChanging = true;
    this.nav.push("IntroPage");
    this.menuCtrl.close().then(() => {
      this.pageChanging = false;
    })
  }

  logout() {
    this.pageChanging = true;
    this.authProvider.logout();
    this.nav.push("IntroPage");
    this.menuCtrl.close().then(() => {
      this.pageChanging = false;
    })
  }

  isVisitDefined() {
    return !!localStorage.getItem('visit-id')
  }

  userTokenPresent() {
    return !!localStorage.getItem('user-token')
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Conferma uscita',
      message: "Vuoi uscire dall'app?",
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.alertShown = false;
          }
        },
        {
          text: 'Si',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    alert.present().then(() => {
      this.alertShown = true;
    });
  }
}
