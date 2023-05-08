import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {VisitProvider} from "../../providers/visit/visit";
import {VisitProgressModel} from "../../model/visitProgress.model";
import {Visit} from "../../model/visit.model";
import _ from "lodash";
import {MessageProvider} from "../../providers/message/message";
import {Geolocation} from "@ionic-native/geolocation";

/**
 * Generated class for the VisitProgressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-visit-progress',
  templateUrl: 'visit-progress.html',
})
export class VisitProgressPage {
  public progress = 0;
  public checked: boolean = true;
  public notChecked: boolean = false;
  public doughnutChartLabels: string[] = ['Completato', 'Da completare'];
  public doughnutChartData: number[] = [0, 100];
  public visitProgress: VisitProgressModel;
  public colors: Array<any> = [
    {
      backgroundColor: ['#A000EE', '#03DAC6']
    }
  ];
  public options: any = {
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    }
  };

  public doughnutChartType: string = 'doughnut';
  public visit: Visit;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public visitProvider: VisitProvider,
              public loaderCtrl: LoadingController,
              public toastController: ToastController,
              public messageProvider: MessageProvider,
              private geolocation: Geolocation) {
    this.visitProgress = new VisitProgressModel();
    let loader = this.loaderCtrl.create();
    loader.present();
    this.visitProvider.getByUsername().subscribe(visit => {
      loader.dismiss();
      this.visit = visit;
      localStorage.setItem('visit-id', this.visit.id.toString());
      this.visitProgress.update(visit);
      this.doughnutChartData = [this.visitProgress.percentage, 100 - this.visitProgress.percentage];
      this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then(value => {
        this.visitProvider.updateCurrentPosition(value.coords.latitude, value.coords.longitude, visit.id).subscribe(res => {
          console.log('Aggiornate le coordinate');
        }, err => {
          console.log('non è stato possibile aggiornare ultime le coordinate')
        })
      })

    }, err => {
      if (_.has(err, 'error.params.visitNotCreated')) {
        this.visitProvider.create().subscribe(visit => {
          this.visit = visit;
          localStorage.setItem('visit-id', this.visit.id.toString());
          loader.dismiss();
        }, error2 => {
          loader.dismiss();
          this.messageProvider.createDefaultToast("Errore durante l'inizializzazione della visita, riprovare.");
        })
      } else {
        loader.dismiss();
        this.messageProvider.createDefaultToast("Errore durante l'inizializzazione della visita, riprovare.");
      }
    })
  }

  ionViewDidLoad() {
  }

  visitPage() {
    if (!!this.visit) {
      this.navCtrl.setRoot("VisitPage")
    }
  }

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
