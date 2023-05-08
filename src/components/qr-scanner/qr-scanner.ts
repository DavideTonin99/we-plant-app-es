import { Component } from '@angular/core';
import _ from "lodash";
import {Albero} from "../../model/albero.model";
import {AlberoProvider} from "../../providers/albero/albero";
import {AlertController, NavController, ViewController} from "ionic-angular";

/**
 * Generated class for the QrScannerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'qr-scanner',
  templateUrl: 'qr-scanner.html'
})
export class QrScannerComponent {

  text: string;
  plantCode: number;
  enableScanner: boolean = false;


  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController) {
    console.log('Hello QrScannerComponent Component');
    this.text = 'Hello World';
    console.log('constructor');

  }

  ionViewDidLoad() {
    this.enableScanner = true;
  }

  capturedQr(barcodeData) {

    console.log('Barcode data', barcodeData);
    this.enableScanner = false;
    this.viewCtrl.dismiss(barcodeData);

  }

  scanErrorHandler(result) {
    //this.alertCtrl.create({message: "Impossibile attivare la fotocamera, accertati di aver fornito i permessi per la fotocamera.", buttons: [{text: "ok"}]}).present();
    console.log(result);
  }

  closeModal(){
    this.enableScanner = false;
    this.viewCtrl.dismiss(null);
  }
}
