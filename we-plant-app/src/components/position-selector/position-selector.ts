import {Component} from '@angular/core';
import {AlertController, LoadingController, NavParams, ToastController, ViewController} from "ionic-angular";
import {GoogleMap, GoogleMaps, GoogleMapsEvent, ILatLng, LatLng, Marker} from "@ionic-native/google-maps";
import {Loading} from "ionic-angular/components/loading/loading";
import {Geolocation} from "@ionic-native/geolocation";

/**
 * Generated class for the PositionSelectorComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'position-selector',
  templateUrl: 'position-selector.html'
})
export class PositionSelectorComponent {

  text: string;
  map: GoogleMap;
  currentPosition: Marker;
  latlng: ILatLng;

  constructor(params: NavParams,
              public viewCtrl: ViewController,
              private loadingCtrl: LoadingController,
              private geolocation: Geolocation,
              private alertCtrl: AlertController,
              private toastController: ToastController) {
    console.log('Hello PositionSelectorComponent Component');
    this.text = 'Hello World';
    this.loadMap();
  }

  loadMap() {
    let loader = this.loadingCtrl.create({content: 'Rilevamento coordinate', spinner: 'dots'});
    loader.present();
    setTimeout(() => {
      this.map = GoogleMaps.create('map_canvas_ps');
      this.map.addEventListener(GoogleMapsEvent.MAP_LONG_CLICK).subscribe(res => {
        console.log(res)
        this.latlng = (<LatLng>res[0]);
        this.updateMapAndIcon(false);
      })
      this.getMyPosition(loader);
      this.toastController.create({
        message: "Premere a lungo per spostarsi in una nuova posizione",
        showCloseButton: true,
        closeButtonText: 'ok',
        duration: 5000
      }).present();
      console.log("Map loaded", this.map)
    }, 1000)
  }

  chiudi() {
    this.viewCtrl.dismiss(this.latlng);
  }

  getMyPosition(loader: Loading) {
    if (!loader) {
      loader = this.loadingCtrl.create({content: 'Rilevamento coordinate', spinner: 'dots'});
      loader.present();
    }
    console.log('getMyPosition');
    this.geolocation.getCurrentPosition({enableHighAccuracy: true, timeout: 20000}).then(res => {
      console.log(res)
      loader.dismiss();
      this.latlng = {lat: res.coords.latitude, lng: res.coords.longitude};
      this.updateMapAndIcon(true);
    }, err => {
      loader.dismiss();
      console.log("Non è stato possibile rilevare la tua posizione");
      this.alertCtrl.create({
        buttons: [{text: "Ok"}],
        message: "Non è stato possibile rilevare la tua posizione, assicurati di essere all'aperto, di aver acceso il gps e riprova"
      }).present();
    })
  }

  createCurrentPositionIcon(latLng: ILatLng) {
    this.map.addMarker(
      {
        position: latLng,
        icon: {
          url: './assets/icon/location-icon.png',
          size: {
            width: 32,
            height: 32
          }
        }
      }).then(marker => {
      this.currentPosition = marker;
    })
  }

  private updateMapAndIcon(cameraTarget: boolean) {
    if (cameraTarget) {
      this.map.setCameraTarget(this.latlng);
      this.map.setCameraZoom(19);
    }
    if (!!this.currentPosition) {
      this.currentPosition.remove()
      this.createCurrentPositionIcon(this.latlng);
    } else {
      this.createCurrentPositionIcon(this.latlng);
    }
  }
}
