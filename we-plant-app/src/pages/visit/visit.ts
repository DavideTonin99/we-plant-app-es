import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {ExplorPage} from "../explor/explor";
import {VisitProvider} from "../../providers/visit/visit";
import {Stop, Visit} from "../../model/visit.model";
import {MessageProvider} from "../../providers/message/message";
import {PoiProvider} from "../../providers/poi/poi";
import {forkJoin} from "rxjs/observable/forkJoin";
import _ from "lodash";
import {CategoryProvider} from "../../providers/category/category";
import {Geolocation} from "@ionic-native/geolocation";
import {Loading} from "ionic-angular/components/loading/loading";

/**
 * Generated class for the VisitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-visit',
  templateUrl: 'visit.html',
})
export class VisitPage {
  visit: Visit;
  currentId;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public visitProvider: VisitProvider,
              public loadingCtrl: LoadingController,
              public messageProvider: MessageProvider,
              public poiProvider: PoiProvider,
              public categoryProvider: CategoryProvider,
              public geolocation: Geolocation,
              public alertCtrl: AlertController) {
    this.loadVisit();
  }

  ionViewWillEnter() {
    if (!!localStorage.getItem('load-visit')) {
      this.loadVisit();
    }
  }

  stop(stopId) {
    console.log(stopId);
  }

  loadVisit() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.visitProvider.getByUsername().subscribe(visit => {
      this.visit = visit;
      if (!!this.visit.directionsResult && !!this.visit.directionsResult.routes && this.visit.directionsResult.routes.length > 0) {
        let reached: Array<Stop> = _.filter(this.visit.stops, {reached: true});
        let notReached: Array<Stop> = [];
        let notReachedTmp: Array<Stop> = _.filter(this.visit.stops, {reached: false});
        this.visit.directionsResult.routes[0].waypointOrder.forEach(order => {
          notReached.push(notReachedTmp[order]);
        });
        this.visit.stops = [];
        this.visit.stops.push(...reached)
        this.visit.stops.push(...notReached);
        if (!this.visit.inProgress) {
          this.currentId = this.visit.startPoint.id;
        }
        else if (notReached.length > 0) {
          this.currentId = notReached[0].id;
        } else if (notReached.length == 0) {
          this.currentId = this.visit.endPoint.id;
        }
      }

      this.geolocation.getCurrentPosition().then(value => {
        this.visitProvider.updateCurrentPosition(value.coords.latitude, value.coords.longitude, visit.id).subscribe(res => {
          console.log('Aggiornate le coordinate');
        }, err => {
          console.log('non è stato possibile aggiornare ultime le coordinate')
        })
      })
      this.visit.pois = [];
      if (this.visit.stops.length > 0 || !!this.visit.startPoint || !!this.visit.endPoint) {
        let pois$ = [];
        this.visit.stops.forEach(stop => {
          pois$.push(this.poiProvider.get(stop.poiId));
        })
        if (!!this.visit.startPoint && !!this.visit.startPoint.poiId) {
          pois$.push(this.poiProvider.get(this.visit.startPoint.poiId));
        }
        if (!!this.visit.endPoint && !!this.visit.endPoint.poiId) {
          pois$.push(this.poiProvider.get(this.visit.endPoint.poiId));
        }
        if(pois$.length == 0){
          loader.dismiss();
        }
        forkJoin(pois$).subscribe(pois => {
          pois.forEach(poi => {
            this.visit.stops.forEach(stop => {
              if (stop.poiId == (<any>poi).id) {
                stop._source = poi;
              }
            })
            if (!!this.visit.startPoint && this.visit.startPoint.poiId == (<any>poi).id) {
              this.visit.startPoint._source = poi;
            }
            if (!!this.visit.endPoint && this.visit.endPoint.poiId == (<any>poi).id) {
              this.visit.endPoint._source = poi;
            }
          })
          loader.dismiss();
          console.log(this.visit.stops);
        }, err => {
          loader.dismiss();
        })
        /**/
      } else {
        loader.dismiss();
      }
    }, err => {
      loader.dismiss();
    })
  }


  removeRelement(stop: Stop) {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.visitProvider.removePoi(stop.id)
      .subscribe(() => {
        this.loadVisit();
        loader.dismiss();
        this.messageProvider.createDefaultToast("Punto d'interesse rimosso dalla visita");

      }, error => {
        this.messageProvider.createDefaultToast("Non è stato possibile rimuovere il punto d'interesse");
        loader.dismiss();
      })
  }

  explore() {
    this.navCtrl.push("ExplorPage")
  }

  exploreForDestination() {
    this.navCtrl.push("ExplorPage", {destination: true})

  }

  map() {
    if (!this.visit.startPoint) {
      this.messageProvider.createDefaultToast("Punto di partenza non impostato");
    }
    else if (!this.visit.endPoint) {
      this.messageProvider.createDefaultToast("Punto di arrivo non impostato");
    }
    else if (!this.visit.maxVisitTime) {
      this.messageProvider.createDefaultToast("Minuti a disposizione non impostati");
    }
    else if (!this.visit.stops || !!this.visit.stops && this.visit.stops.length == 0) {
      this.messageProvider.createDefaultToast("Tappe non aggiunte");
    }
    else {
      let loader = this.loadingCtrl.create();
      loader.present();
      this.geolocation.getCurrentPosition().then(value => {
        this.startVisit(this.visit.id, value.coords.latitude, value.coords.longitude, loader);
      }, err => {
        this.startVisit(this.visit.id, null, null, loader);
      })
    }


  }

  continueVisit() {
    this.navCtrl.setRoot("MapPage");
  }

  startVisit(visitId: number, lat, lon, loader: Loading) {
    this.visitProvider.startVisit(this.visit.id, null, null)
      .subscribe(visit => {
        this.visit.inProgress = true;
        this.navCtrl.push("MapPage")
        loader.dismiss();
      }, err => {
        this.messageProvider.createDefaultToast("Errore imprevisto, riprovare");
        loader.dismiss();
      })
  }

  setDifficulty(difficulty: string) {
    this.visit.difficulty = difficulty;
    this.visitProvider.update(this.visit).subscribe();
  }

  update($event) {
    console.log($event)
    this.visitProvider.update(this.visit).subscribe();
  }

  getCategory(stop: Stop) {
    return this.categoryProvider.getCategoryByStop(stop);
  }

  getName(stop: Stop) {
    return _.has(stop, '_source.tags.name') ? stop._source.tags.name : '';
  }

  isFirst(stop: Stop) {
    return stop.id == this.currentId
  }

  getStreetName(stop: Stop) {
    return _.has(stop, '_source.street_address') ? stop._source.street_address : '';
  }

  detail(stop: Stop) {
    if (stop.stopType != 'MY_POSITION') {
      this.navCtrl.push("PoiPage", {poi: stop, it: this.getCategory(stop), fromMarker: true, visit: this.visit})
    }
  }

  finishVisit() {
    const alert = this.alertCtrl.create({
      title: 'Termina visita',
      subTitle: "Sicuro di voler terminare la visita?",
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
            let loader = this.loadingCtrl.create();
            loader.present();
            this.visitProvider.create().subscribe(visit => {
              localStorage.setItem('visit-id', visit.id.toString());
              loader.dismiss();
              this.loadVisit();
            }, err => {
              this.messageProvider.createDefaultToast("Errore durante la terminazione della visita. Riprovare");
              loader.dismiss();
            })
          }
        }
      ]
    });
    alert.present();
  }

  exploreForStart() {
    this.navCtrl.push("ExplorPage", {startPoint: true})
  }

  removeStartPoint() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.visitProvider.removeStartPoint(this.visit.id).subscribe(() => {
      loader.dismiss();
      this.loadVisit();
    }, err => {
      this.messageProvider.createDefaultToast("Non è stato possibile eliminare il punto di partenza. Riprovare.");
      loader.dismiss();
    })
  }

  removeEndPoint() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.visitProvider.removeEndPoint(this.visit.id).subscribe(() => {
      loader.dismiss();
      this.loadVisit();
    }, err => {
      this.messageProvider.createDefaultToast("Non è stato possibile eliminare la traguardo. Riprovare.");
      loader.dismiss();
    })
  }
}
