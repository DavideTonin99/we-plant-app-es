import {Component} from '@angular/core';
import {
  AlertController, IonicPage, LoadingController, Modal, ModalController, NavController, NavParams,
  Platform
} from 'ionic-angular';
import {AreaVerdeModel} from "../../model/areaVerde";
import {Geolocation, Geoposition} from "@ionic-native/geolocation";
import {ComuneProvider} from "../../providers/comune/comune";
import {AlberoProvider} from "../../providers/albero/albero";
import {WktProvider} from "../../providers/wkt/wkt";
import {Albero} from "../../model/albero.model";
import {Loading} from "ionic-angular/components/loading/loading";
import {PositionSelectorComponent} from "../../components/position-selector/position-selector";
import {ILatLng} from "@ionic-native/google-maps";

/**
 * Generated class for the DiagnosticsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-diagnostics',
  templateUrl: 'diagnostics.html',
})
export class DiagnosticsPage {
  display = 'block'
  areaVerde: AreaVerdeModel;
  watch;
  private currentPosition: ILatLng;
  private alberi: Array<Albero>;
  private modal: Modal;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public comuneProvider: ComuneProvider,
              public alberoProvider: AlberoProvider,
              public wktProvider: WktProvider,
              public alertCtrl: AlertController,
              public geolocation: Geolocation,
              public loadControler: LoadingController,
              public modalCtrl: ModalController,
              public platform: Platform) {
    this.platform.registerBackButtonAction(()=>{
      console.log('back button diag')
      if(!!this.modal){
        this.display = 'block';
        this.modal.dismiss().then(res=>{
          this.modal = null;
        })
      }else {
        this.navCtrl.pop();
      }
    })
    this.updateLocation();
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
/*    this.watch = this.geolocation.watchPosition().subscribe(data => {
      console.log("invalid position", data);
      if (!!data.coords) {
        console.log("current position updated");
        this.currentPosition = data;
      }

    })*/
  }

  updateLocation() {
    this.display = 'none';
    this.modal = this.modalCtrl.create(PositionSelectorComponent, {modal: this});
    this.modal.present().then(res => {
      console.log('returned');
    });
    this.modal.onDidDismiss((res: ILatLng) => {
      this.display = 'block';
      this.currentPosition = res;
      if(!!res && !!res.lat && !!res.lng){
        let loader = this.loadControler.create();
        loader.present();
        this.loadAreaVerde(res, loader);
      }
    })

  }

  private loadAreaVerde(res: ILatLng, loading: Loading) {
    this.comuneProvider.getAreaVerde(res.lat, res.lng).subscribe(res => {
      if (!!res && JSON.parse(res).length > 0) {
        console.log(JSON.parse(res));
        this.areaVerde = JSON.parse(res)[0];
        this.alberoProvider.findByCodiceArea(JSON.parse(res)[0].CODICE).subscribe(res => {
          this.alberi = res;
          loading.dismiss();
        }, err => {
          loading.dismiss();
        })
      } else {
        console.log("Area verde non trovata")
        loading.dismiss();
      }

    }, err => {
      loading.dismiss();
    })
  }

}
