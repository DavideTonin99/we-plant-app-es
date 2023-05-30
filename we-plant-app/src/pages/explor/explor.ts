import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {ExploreDetailPage} from "../explore-detail/explore-detail";
import {CategoryProvider} from "../../providers/category/category";
import {VisitProvider} from "../../providers/visit/visit";
import {StartEndPoint} from "../../model/startEndPoint.model";
import {MessageProvider} from "../../providers/message/message";
import {VisitUtilProvider} from "../../providers/visit-util/visit-util";

/**
 * Generated class for the ExplorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-explor',
  templateUrl: 'explor.html',
})
export class ExplorPage {
  search = false;
  myInput;
  shouldShowCancel: true;
  destination = false;
  startPoint = false;
  tourismList = CategoryProvider.TOURISM;
  amenityList = CategoryProvider.AMENITY;
  venetoNightList = CategoryProvider.VENETO_NIGHT;
  poveglianoList = CategoryProvider.POVEGLIANO;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public visitProvider: VisitProvider,
              public messageProvider: MessageProvider,
              public visitUtilProvider: VisitUtilProvider) {
    if (!!this.navParams.get('destination')) {
      this.destination = true;
    }
    if (!!this.navParams.get('startPoint')) {
      this.startPoint = true;
    }

  }

  ionViewDidLoad() {
  }

  onInput($event) {

  }

  onCancel($event) {

  }

  exploreTourism(tourism) {
    this.navCtrl.push("ExploreDetailPage",
      {
        type: !!tourism.category? tourism.category :  'TOURISM',
        key: tourism.key,
        it: tourism.it,
        startPoint: this.startPoint,
        destination: this.destination
      });
  }

  exploreService(service) {
    this.navCtrl.push("ExploreDetailPage",
      {
        type: !!service.category? service.category : 'AMENITY',
        key: service.key,
        it: service.it,
        startPoint: this.startPoint,
        destination: this.destination
      });
  }

  exploreVenetoNight(venetoNight) {
    this.navCtrl.push("ExploreDetailPage",
      {
        type: 'EVENT',
        key: venetoNight.key,
        it: venetoNight.it,
        startPoint: this.startPoint,
        destination: this.destination
      });
  }

  addDestionationOrStartPoint() {
    this.visitUtilProvider.addCurrentPositionAsDestionationOrStartPoint(this.startPoint);
  }
}
