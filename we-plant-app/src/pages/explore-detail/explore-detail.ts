import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {PoiPage} from "../poi/poi";
import {PoiProvider} from "../../providers/poi/poi";
import {VisitProvider} from "../../providers/visit/visit";
import {MessageProvider} from "../../providers/message/message";
import {VisitUtilProvider} from "../../providers/visit-util/visit-util";

/**
 * Generated class for the ExploreDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-explore-detail',
  templateUrl: 'explore-detail.html',
})
export class ExploreDetailPage {
  categoryNameIt;
  poiList = [];
  startPoint;
  destination;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public poiProvider: PoiProvider,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public visitProvider: VisitProvider,
              public visitUtilProvider: VisitUtilProvider,
              public messageProvider: MessageProvider,
              public loadingCtrl: LoadingController) {
    let type = this.navParams.get('type');
    let key = this.navParams.get('key');
    this.categoryNameIt = this.navParams.get('it');
    this.startPoint = this.navParams.get('startPoint');
    this.destination = this.navParams.get('destination');
    let loading = loadingCtrl.create();
    this.poiProvider.getByType(type, key).subscribe(poiList => {
      this.poiList = poiList;
      loading.dismiss();
    })
  }

  ionViewDidLoad() {
  }

  poiDetail(poi) {
    this.navCtrl.push("PoiPage",
      {
        poi: poi,
        it: this.categoryNameIt,
        startPoint: this.startPoint,
        destination: this.destination
      })
  }

  debugPoi(poi) {
    const alert = this.alertCtrl.create({
      title: 'Debug',
      subTitle: JSON.stringify(poi._source),
      buttons: ['OK']
    });
    alert.present();
  }

  add(poi) {
    this.visitUtilProvider.addPoi(poi, this.destination, this.startPoint);
  }

  getAddress(poi: any) {
    /*    let street = poi._source.tags['addr:street'];
        let housenumber = poi._source.tags['addr:housenumber'];
        if (!!street && housenumber) {
          return poi._source.tags['addr:street'] + ', ' + poi._source.tags['addr:housenumber'];
        } else if (!!street) {
          return poi._source.tags['addr:street'];
        }*/
    return poi._source.street_address;
  }
}
