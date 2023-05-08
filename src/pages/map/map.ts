import {Component, ElementRef, ViewChild} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  Platform,
  ToastController
} from 'ionic-angular';
import {
  Encoding,
  GoogleMap,
  GoogleMaps,
  GoogleMapsEvent,
  ILatLng,
  LatLng,
  Marker,
  MarkerCluster,
  MarkerOptions,
  Polyline
} from "@ionic-native/google-maps";
import {Geolocation} from '@ionic-native/geolocation';
import {VisitProvider} from "../../providers/visit/visit";
import {Leg, Stop, Visit} from "../../model/visit.model";
import _ from "lodash";
import {CategoryProvider} from "../../providers/category/category";
import {PoiProvider} from "../../providers/poi/poi";
import {GeoFancingProvider} from "../../providers/geo-fancing/geo-fancing";
import {ConfigProvider} from "../../providers/config/config";
import {Albero} from "../../model/albero.model";
import {AlberoProvider} from "../../providers/albero/albero";
import {WktProvider} from "../../providers/wkt/wkt";
import {ComuneProvider} from "../../providers/comune/comune";
import {AuthProvider} from "../../providers/auth/auth";
import {AndroidPermissions} from "@ionic-native/android-permissions";

declare var google;

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
enum MapType {
  MAP_TYPE_NORMAL = 'MAP_TYPE_NORMAL',
  MAP_TYPE_ROADMAP = 'MAP_TYPE_ROADMAP',
  MAP_TYPE_SATELLITE = 'MAP_TYPE_SATELLITE',
  MAP_TYPE_HYBRID = 'MAP_TYPE_HYBRID',
  MAP_TYPE_TERRAIN = 'MAP_TYPE_TERRAIN',
  MAP_TYPE_NONE = 'MAP_TYPE_NONE'
}

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})

export class MapPage {
  display = 'block';
  primary = '#03DAC6';
  secondary = '#A000EE';
  currentPosition: Marker;
  watch;
  polyline: Polyline;
  alberiSenzaTarghette: Array<Albero> = [];
  markers: Array<MarkerOptions> = [];
  selectorMode: boolean = false;
  latitude: number;
  longitude: number;
  private visit: Visit;
  private positionAuto: boolean = false;
  private callback: any;
  private currentMapType = MapType.MAP_TYPE_NORMAL;
  private lastPosition: ILatLng;
  @ViewChild('map_canvas') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private platform: Platform,
              private geolocation: Geolocation,
              private visitProvider: VisitProvider,
              public actionSheetCtrl: ActionSheetController,
              private categoryProvider: CategoryProvider,
              private poiProvider: PoiProvider,
              private geoFancing: GeoFancingProvider,
              private alertCtrl: AlertController,
              private config: ConfigProvider,
              private alberoProvider: AlberoProvider,
              private loadingCtrl: LoadingController,
              private wktProvider: WktProvider,
              private comuneProvider: ComuneProvider,
              private authProvider: AuthProvider,
              private modalCtrl: ModalController,
              private toastController: ToastController,
              private androidPermissions: AndroidPermissions) {
    /*    this.selectorMode = this.navParams.get('selector');
        if (this.selectorMode) {
          this.callback = this.navParams.get("callback")
        }*/
  }

  ionViewDidLoad() {
    console.log("test")
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      setTimeout(() => {

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        this.map.addListener('dragend', () => {

          this.latitude = this.map.center.lat();
          this.longitude = this.map.center.lng();

        });
      }, 1000)

    }).catch((error) => {
      console.log('Error getting location', error);
    });

    /*    let loading = this.loadingCtrl.create({spinner: 'dots'});
        loading.present();
        setTimeout(() => {
          loading.dismiss();
          this.loadMap();
        }, 1000)*/
  }

  ionViewWillEnter() {
  }

  ionViewWillLeave() {
    /*    if (!!this.watch) {
          this.watch.unsubscribe();
        }*/
  }


  back() {
    if (this.navCtrl.canGoBack() && !!this.selectorMode) {
      if (!!this.watch) {
        this.watch.unsubscribe();
      }
      if (this.selectorMode) {
        this.callback(!!this.currentPosition ? this.currentPosition.getPosition() : null).then(() => {
          this.navCtrl.pop();
        });
      }
    }
  }


  watchPosition() {
    this.positionAuto = true;
    this.watch = this.geolocation.watchPosition().subscribe(data => {
      console.log("watchPosition", data);
      if (!!data.coords) {
        if (!!this.currentPosition) {
          this.lastPosition = {lat: data.coords.latitude, lng: data.coords.longitude};
          this.updateCurrentPositionIcon(data.coords.latitude, data.coords.longitude);
        }
      }
    });
  }


  getMyPosition() {
    console.log('getMyPosition');
    let loader = this.loadingCtrl.create({spinner: 'dots'});
    loader.present();
    this.geolocation.getCurrentPosition({enableHighAccuracy: true, timeout: 15000}).then(pos => {
      console.log('getMyLocation: ', pos.coords);
      this.createCurrentPositionIconAndLoadArea({lat: pos.coords.latitude, lng: pos.coords.longitude}, loader);

    }).catch(err => {
      loader.dismiss();

      console.log("Non è stato possibile rilevare la tua posizione");
      this.toastController.create({
        message: "Non è stato possibile rilevare la tua posizione",
        closeButtonText: 'ok',
        duration: 5000,
        showCloseButton: true
      }).present();
    })
    if (!this.positionAuto) {
      this.watchPosition();
    }
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

  updateCurrentPositionIcon(latitude, longitude) {
    if (!!this.currentPosition) {
      this.currentPosition.setPosition({lat: latitude, lng: longitude})
    } else {
      this.createCurrentPositionIcon(new LatLng(latitude, longitude))
    }
  }

  loadMap() {
    let loader = this.loadingCtrl.create({spinner: 'dots'});
    loader.present();
    this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then(pos => {
      this.lastPosition = {lat: pos.coords.latitude, lng: pos.coords.longitude};
      this._loadMap(pos.coords.latitude, pos.coords.longitude, loader);
    }).catch(err => {
      console.log("Non è stato possibile rilevare la tua posizione");
      this.toastController.create({
        message: "Non è stato possibile rilevare la tua posizione",
        closeButtonText: 'ok',
        duration: 5000,
        showCloseButton: true
      }).present();
      this._loadMap(45.438665, 10.993430, loader);
    })
  }

  _loadMap(lat, lng, loader: Loading) {
    this.map = GoogleMaps.create(!!this.selectorMode ? 'map_canvas_selector' : 'map_canvas', {
      camera: {
        zoom: 19, target: {
          lat: lat,
          lng: lng
        }
      }
    })
    this.map.addEventListener(GoogleMapsEvent.MAP_READY).subscribe(res => {
      this.createCurrentPositionIcon({lat: lat, lng: lng});
      this.toastController.create({
        message: "Premere a lungo per spostarsi in una nuova posizione",
        showCloseButton: true,
        closeButtonText: 'ok',
        duration: 5000
      }).present();
      console.log("Map loaded", this.map);
      loader.dismiss();
      this.findPlantsWithoutId();
    }, err => {
      console.log("Errore durante il caricamento della mappa");
      this.toastController.create({
        message: "Errore durante il caricamento della mappa",
        showCloseButton: true,
        closeButtonText: 'ok',
        duration: 5000
      }).present();
      loader.dismiss();

    })

    this.map.addEventListener(GoogleMapsEvent.MAP_LONG_CLICK).subscribe(res => {
      this.alertCtrl.create({
        message: 'Vuoi spostarti in questa posizione?',
        buttons: [
          {text: 'Annulla'},
          {
            text: 'Si, sposta', handler: () => {
              this.moveCurrentPositionTo(res[0].lat, res[0].lng)
            }
          }]
      }).present();
    })
  }


  /**
   * Create and return marker that shows an alert
   * @param {string} title
   * @param {number} lat
   * @param {number} lng
   * @returns {MarkerOptions}
   */
  createSimpleMarker(albero: Albero, lat: number, lng: number, iconColor): MarkerOptions {
    let marker: MarkerOptions = {
      icon: iconColor,
      animation: 'DROP',
      albero: albero,
      position: {
        lat: lat,
        lng: lng
      }
    };

    /*    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(clickedElement => {
          console.log(clickedElement, top);
          let alert = this.alertCtrl.create({message: `Hai cliccato su ${title}`, title: "Complimenti"}).present();
        });*/

    return marker;
  }

  addMarker(title, lat, lng, stop: Stop) {
    let category = this.getCategory(stop);
    let name = this.getName(stop);
    let streetName = this.getStreetName(stop);
    title = !_.isEmpty(name) ? name : !_.isEmpty(category) ? 'categoria: ' + category : streetName;
    let marker: Marker = this.map.addMarkerSync({
      icon: 'blue',
      animation: 'DROP',
      title: stop.stopType == "MY_POSITION" ? 'La mia posizione' : null,
      position: {
        lat: lat,
        lng: lng
      }
    });
    if (stop.stopType != "MY_POSITION") {
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(clickedElement => {
        console.log(clickedElement, top);
        if (this.authProvider.isAnonimusUser()) {

        } else {
          this.navCtrl.push("PoiPage", {poi: stop, it: category, fromMarker: true, visit: this.visit})
        }
      });
    }

  }

  getCategory(stop: Stop) {
    return this.categoryProvider.getCategoryByStop(stop);
  }

  getName(stop: Stop) {
    return _.has(stop, '_source.tags.name') ? stop._source.tags.name : _.has(stop, 'tags.name') ? stop.tags.name : '';
  }

  getStreetName(stop: Stop) {
    return _.has(stop, '_source.street_address') ? stop._source.street_address : '';
  }

  addMarkers() {
    if (!!this.visit.directionsResult.routes && this.visit.directionsResult.routes.length > 0) {
      this.visit.directionsResult.routes[0].legs.forEach((leg, index) => {
        if (index != 0) {
          let stopIndex = this.visit.directionsResult.routes[0].waypointOrder[index - 1];
          let stop: Stop = _.filter(this.visit.stops, {reached: false})[stopIndex];
          this.addMarker(leg.startAddress, leg.startLocation.lat, leg.startLocation.lng, stop);
        }
      });
      let lastStop: Stop = this.visit.endPoint;
      console.log('last stop', lastStop);
      let leg: Leg = this.visit.directionsResult.routes[0].legs[this.visit.directionsResult.routes[0].legs.length - 1];
      this.addMarker(leg.endAddress, leg.endLocation.lat, leg.endLocation.lng, lastStop);
      let points: ILatLng[] = Encoding.decodePath(this.visit.directionsResult.routes[0].overviewPolyline.encodedPath);
      if (!!this.polyline) {
        this.polyline.remove();
      }
      this.map.addPolyline({points: points}).then((polyline: Polyline) => {
        this.polyline = polyline;

      })
    }
  }

  /**
   * Swith map from satellite to standars and vice versa
   */
  toggleMapType() {
    if (this.currentMapType == MapType.MAP_TYPE_NORMAL) {
      this.map.setMapTypeId(MapType.MAP_TYPE_SATELLITE)
      this.currentMapType = MapType.MAP_TYPE_SATELLITE;
    } else {
      this.map.setMapTypeId(MapType.MAP_TYPE_NORMAL)
      this.currentMapType = MapType.MAP_TYPE_NORMAL;
    }
  }

  /**
   * Reload all elements on the map
   */
  refreshMap() {
    let loader = this.loadingCtrl.create({spinner: 'dots'});
    loader.present();
    this.map.clear().then(res => {
      this.createCurrentPositionIconAndLoadArea(this.lastPosition, loader);
      this.findPlantsWithoutId();
    }, err => {
      console.log('Cannot clear map');
      loader.dismiss();
    })

  }

  /**
   * Load current area verde and his own trees
   * @param lat
   * @param lon
   */
  private loadAreaVerde(lat, lon, loader: Loading) {
    this.comuneProvider.getAreaVerde(lat, lon).subscribe(res => {
      if (!!res && JSON.parse(res).length > 0) {
        this.findByCodiceArea(JSON.parse(res)[0].CODICE, loader);
      } else {
        loader.dismiss()
        console.log("Area verde non trovata")
      }
    }, err => {
      loader.dismiss()
      console.log("Area verde non trovata")
    })
  }

  /**
   * Load trees by area verde code
   * @param {string} CODICE
   */
  private findByCodiceArea(CODICE: string, loader: Loading) {
    this.alberoProvider.findByCodiceArea(CODICE).subscribe(res => {
      loader.dismiss();
      this.markers = [];
      res.forEach(albero => {
        let latLon = this.wktProvider.toLatLon(albero.wkt);
        this.markers.push(this.createSimpleMarker(albero, latLon.lat, latLon.lng, this.primary))
      })

      this.map.addMarkerCluster({
        markers: this.markers,
        icons: [
          {
            url: "assets/icon/tree.png",
            min: 2
          }
        ]
      }).then((value: MarkerCluster) => {
        value.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe(e => {
          console.log(e[1]._objectInstance.get('albero'));
          let loader = this.loadingCtrl.create({spinner: 'dots'});
          loader.present();
          this.alberoProvider.find(e[1]._objectInstance.get('albero').id).subscribe(albero => {
            loader.dismiss();
            let alert = this.alertCtrl.create({
              message: albero.essenza.genereESpecie,
              buttons: [
                {text: "Chiudi"},
                {
                  text: "Dettaglio", handler: () => {
                    sessionStorage.setItem('albero', JSON.stringify(albero));
                    this.navCtrl.push("AlberoDetailsPage", {albero: albero});
                  }
                }]
            }).present();
          }, err => {
            loader.dismiss();
          })
        })
      });
    }, err => {
      loader.dismiss();
    })
  }

  /**
   * Move current position pointer and load corresponding area verde
   * @param lat
   * @param lng
   */
  private moveCurrentPositionTo(lat, lng) {
    this.positionAuto = false;
    if (!!this.watch) {
      this.watch.unsubscribe();
    }
    if (!!this.currentPosition) {
      this.currentPosition.setPosition({lat: lat, lng: lng})
    } else {
      this.createCurrentPositionIcon({lat: lat, lng: lng});
    }
    let loader = this.loadingCtrl.create({spinner: 'dots'});
    loader.present();
    this.loadAreaVerde(lat, lng, loader);

  }

  /**
   * Load plants without 'idPianta' field
   */
  private findPlantsWithoutId() {
    let loader = this.loadingCtrl.create({spinner: 'dots'});
    this.alberoProvider.findPlantsWithoutId().subscribe(res => {
      loader.dismiss();
      this.alberiSenzaTarghette = res;
      let markers: Array<MarkerOptions> = [];
      this.alberiSenzaTarghette.forEach(albero => {
        let latLon = this.wktProvider.toLatLon(albero.wkt);
        markers.push(this.createSimpleMarker(albero, latLon.lat, latLon.lng, this.secondary))
      })

      this.map.addMarkerCluster({
        markers: markers,
        icons: [
          {
            url: "assets/icon/tree-secondary.png",
            min: 2
          }
        ]
      }).then((value: MarkerCluster) => {
        value.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe(e => {
          console.log(e[1]._objectInstance.get('albero'));
          let loader = this.loadingCtrl.create({spinner: 'dots'});
          loader.present();
          this.alberoProvider.find(e[1]._objectInstance.get('albero').id).subscribe(albero => {
            loader.dismiss();
            let alert = this.alertCtrl.create({
              message: `${albero.essenza.genereESpecie}`,
              buttons: [
                {text: "Chiudi"},
                {
                  text: this.authProvider.isCurrentUserAdmin() ? "Completa scheda" : "Visualizza scheda",
                  handler: () => {
                    sessionStorage.setItem('albero', JSON.stringify(albero));
                    this.navCtrl.push("AlberoDetailsPage", {
                      albero: albero,
                      toComplite: this.authProvider.isCurrentUserAdmin()
                    })
                  }
                }]
            }).present();
          }, err => {
            loader.dismiss();
          })


        })
      });
    }, err => {
      loader.dismiss();
    })
  }

  private createCurrentPositionIconAndLoadArea(latLng: ILatLng, loader: Loading) {
    if (!!this.map) {
      this.map.setCameraTarget(latLng);
      this.lastPosition = latLng;
      if (!!this.currentPosition) {
        this.currentPosition.remove()
        this.createCurrentPositionIcon(latLng);
      } else {
        this.createCurrentPositionIcon(latLng);
      }
      this.loadAreaVerde(latLng.lat, latLng.lng, loader);
    } else {
      console.error('mappa non inizializzata');
    }

  }
}
