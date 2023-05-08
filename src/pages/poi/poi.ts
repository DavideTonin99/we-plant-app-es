import {Component} from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  PopoverController,
  ToastController
} from 'ionic-angular';
import {PoiOptionsPage} from "../poi-options/poi-options";
import {VisitProvider} from "../../providers/visit/visit";
import {MessageProvider} from "../../providers/message/message";
import {Stop, Visit} from "../../model/visit.model";
import {VisitUtilProvider} from "../../providers/visit-util/visit-util";
import {PoiProvider} from "../../providers/poi/poi";

/**
 * Generated class for the PoiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-poi',
  templateUrl: 'poi.html',
})
export class PoiPage {
  poi: Stop;
  categoryNameIt;
  fromMarker = false;
  visit: Visit;
  stopReached;
  geoFanceReached;
  totalStops = 0;
  reachedStops = 0;
  private startPoint;
  private destination;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public popoverCtrl: PopoverController,
              public toastCtrl: ToastController,
              public visitProvider: VisitProvider,
              public messageProvider: MessageProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public visitUtilProvider: VisitUtilProvider,
              public poiProvider: PoiProvider) {
    this.poi = this.navParams.get('poi');
    this.categoryNameIt = this.navParams.get('it');
    console.log(this.categoryNameIt);
    if (!!this.navParams.get('fromMarker')) {
      this.fromMarker = true;
    }
    if (!!this.navParams.get('visit')) {
      this.visit = this.navParams.get('visit');
      this.totalStops = this.visit.stops.length;
      this.visit.stops.forEach(stop => {
        if (stop.reached) {
          this.reachedStops++;
        }
      });
    }
    if (!!this.poi.poiId) {
      let loader = this.loadingCtrl.create();
      loader.present();
      this.poiProvider.get(this.poi.poiId).subscribe(source => {
        this.poi._source = source;
        loader.dismiss();
      }, err => {
        loader.dismiss();
      })
    }
    if (!!this.navParams.get('geoFanceReached')) {
      this.reachedWrapper(this.poi);
    }
    this.startPoint = this.navParams.get('startPoint');
    this.destination = this.navParams.get('destination');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PoiPage');
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create("PoiOptionsPage");
    popover.present({
      ev: myEvent
    });
  }

  add(poi) {
    this.visitUtilProvider.addPoi(poi, this.destination, this.startPoint);
  }

  reached(poi: Stop) {
    let alert = this.alertCtrl.create({
      title: 'Tappa raggiunta',
      message: 'Confermi di aver raggiunto questa destinazione?',
      buttons: [
        {
          text: 'Chiudi',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confermo',
          handler: () => {
            this.reachedWrapper(poi);
          }
        }
      ]
    });
    alert.present();
  }

  getVisitPercentage() {
    return Math.round((100 * this.reachedStops) / this.totalStops);
  }

  getTimePercentage() {
    return Math.round(100 - (100 * this.visit.maxVisitTime - this.visit.minutesToGo) / this.visit.maxVisitTime);
  }

  private reachedWrapper(poi: Stop) {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.visitProvider.reached(poi)
      .subscribe(() => {
        localStorage.setItem('load-visit', "true");
        this.reachedStops = 0;
        this.visit.stops.forEach(stop => {
          if (stop.id == poi.id) {
            stop.reached = true;
          }
          if (stop.reached) {
            this.reachedStops++;
          }
        })
        this.stopReached = true;
        loader.dismiss();
      }, err => {
        loader.dismiss();
      });
  }
}
