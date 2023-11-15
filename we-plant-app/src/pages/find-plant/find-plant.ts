import {Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {AlberoProvider} from "../../providers/albero/albero";
import {Albero} from "../../model/albero.model";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import _ from "lodash";
import {ComuneProvider} from "../../providers/comune/comune";
// import {PositionSelectorComponent} from "../../components/position-selector/position-selector";
// import {ILatLng} from "@ionic-native/google-maps";
import {QrScannerComponent} from "../../components/qr-scanner/qr-scanner";
import {ConfigProvider} from "../../providers/config/config";
import {AuthProvider} from "../../providers/auth/auth";

/**
 * Generated class for the FindPlantPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-find-plant',
  templateUrl: 'find-plant.html',
})
export class FindPlantPage {

  plantCode: string;
  private alberoList: Array<Albero> = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private alberoProvider: AlberoProvider,
              private barcodeScanner: BarcodeScanner,
              public comuneProvider: ComuneProvider,
              private modalCtrl: ModalController,
              private configProvider: ConfigProvider,
              private authProvider: AuthProvider) {
  }

  ionViewDidLoad() {
    let objectId = localStorage.getItem('objectId');
    if (!!objectId) {
      // Get the tree and set the session storage, go to the details of the tree
      // if something goes wrong show the error message
      this.alberoProvider.findByIdPianta(parseInt(objectId)).subscribe((albero: Albero) => {
        // Setup the session storage
        sessionStorage.setItem('albero', JSON.stringify(albero));
        // Navigate to the next page
        this.navCtrl.setRoot("AlberoDetailsPage", {albero: albero});
      }, err => {
        // error 404 can be reached only from logged user
        if(err.status === 404) {
          // sessionStorage.removeItem('albero');
          let isAnonymous = this.authProvider.isAnonimusUser();
          if(!isAnonymous) {
            sessionStorage.setItem('newIdPianta', JSON.stringify(objectId));
            this.navCtrl.setRoot("FindPlantPage");
            this.navCtrl.push("AlberoDetailsPage", {newIdPianta: objectId});
          } else {
            const alert = this.alertCtrl.create({
              message: "Albero non trovato negli archivi",
              buttons: [{text: "ok"}]
            });
            alert.present();
          }
        } else {
          const alert = this.alertCtrl.create({
            message: "Errore " + err.status + ": " + err.message,
            buttons: [{text: "ok"}]
          });
          alert.present();
        }
      })
    }
    localStorage.removeItem('objectId');
  }

  /**
   * Show alert explains the plant code
   */
  inputInfo() {
    let alert = this.alertCtrl.create(
      {
        message: "Il codice albero si trova su una targhetta contenente un Qr Code applicata sulla parte inferiore dell'albero",
        buttons: [{text: "Ok"}]
      });
    alert.present();
  }

  /**
   * Show alert explains the qr code button
   */
  qrCodeInfo() {
    let alert = this.alertCtrl.create(
      {
        message: "Scansiona il codice QR Code che trovi sull'albero",
        buttons: [{text: "Ok"}]
      });
    alert.present();
  }


  scanQrCodeWeb() {
    let modal = this.modalCtrl.create(QrScannerComponent, {modal: this})
    modal.present();
    modal.onDidDismiss((barcodeData) => {
      console.log('Barcode data', barcodeData);
      if (!_.isEmpty(barcodeData)) {
        barcodeData = barcodeData.replace(this.configProvider.qrCodePrefix, '');
        let plantCodeNum = !isNaN(parseInt(barcodeData)) ? parseInt(barcodeData) : null;
        this.alberoProvider.findByIdPianta(plantCodeNum).subscribe((albero: Albero) => {
          sessionStorage.setItem('albero', JSON.stringify(albero));
          this.navCtrl.push("AlberoDetailsPage", {albero: albero})
        }, err => {

          const alert = this.alertCtrl.create({
            message: "Il QR Code scansionato non risulta censito nei nostri archivi",
            buttons: [
              {text: "ok"}
            ]
          });
          alert.present();
        })
      } else {
        console.error("barcodeData text is empty");
      }
    });
  }

  /**
   * Find the plant based on plant code
   */
  findPlant() {
    let plantCodeSplit = (this.plantCode || "").split("?")[1];
    this.plantCode = !!plantCodeSplit ? plantCodeSplit.split("=")[1] : this.plantCode;
    let plantCodeNum = !isNaN(parseInt(this.plantCode)) ? parseInt(this.plantCode) : null;
    if (!plantCodeNum) {
      let alert = this.alertCtrl.create(
        {
          message: "Codice albero non inserito!",
          buttons: [{text: "Ok"}]
        });
      alert.present();
    } else {
      this.alberoProvider.findByIdPianta(plantCodeNum).subscribe((albero: Albero) => {
        sessionStorage.setItem('albero', JSON.stringify(albero));
        this.navCtrl.push("AlberoDetailsPage", {albero: albero});

      }, err => {
        const alert = this.alertCtrl.create({
          message: "Il codice inserito non è stato trovato nei nostri archivi",
          buttons: [{text: "ok"}]
        });
        alert.present();
      })
    }
  }
}
