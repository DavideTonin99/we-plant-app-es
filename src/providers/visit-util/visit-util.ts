import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {StartEndPoint} from "../../model/startEndPoint.model";
import {AlertController, LoadingController} from "ionic-angular";
import {Geolocation} from "@ionic-native/geolocation";
import {VisitProvider} from "../visit/visit";
import {MessageProvider} from "../message/message";

/*
  Generated class for the VisitUtilProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VisitUtilProvider {

  constructor(public http: HttpClient,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public geolocation: Geolocation,
              public visitProvider: VisitProvider,
              public messageProvider: MessageProvider) {
  }

  addCurrentPositionAsDestionationOrStartPoint(isStartPoint) {
    let alert = this.alertCtrl.create({
      title: isStartPoint ? 'Punto di partenza' : 'Punto di arrivo',
      message: isStartPoint ?
        'Vuoi impostare la tua posizione attuale come punto di partenza?'
        : 'Vuoi impostare la tua posizione attuale come punto di arrivo?',
      buttons: [
        {
          text: 'CHIUDI',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'CONFERMA',
          handler: () => {
            let loader = this.loadingCtrl.create();
            loader.present();
            this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then(position => {
              if (isStartPoint) {
                let startPoint: StartEndPoint = new StartEndPoint(position.coords.latitude, position.coords.longitude, null, Number(localStorage.getItem('visit-id')));
                this.visitProvider.addStartPoint(startPoint).subscribe(() => {
                  this.messageProvider.createDefaultToast("La tua posizione è stata impostata come punto di partenza");
                  localStorage.setItem('load-visit', "true");
                  loader.dismiss();
                }, err => {
                  this.messageProvider.createDefaultToast("Non è stato possibile impostare la tua posizione, riprovare.");
                  loader.dismiss();
                })
              } else {
                let endPoint: StartEndPoint = new StartEndPoint(position.coords.latitude, position.coords.longitude, null, Number(localStorage.getItem('visit-id')));
                this.visitProvider.addEndPoint(endPoint).subscribe(() => {
                  this.messageProvider.createDefaultToast("La tua posizione è stata impostata come traguardo");
                  localStorage.setItem('load-visit', "true");
                  loader.dismiss();
                }, err => {
                  this.messageProvider.createDefaultToast("Non è stato possibile impostare la tua posizione, riprovare.");
                  loader.dismiss();
                })
              }
            }, err => {
              this.messageProvider.createDefaultToast("Non è stato possibile rilevare la tua posizione, riprovare.");
              loader.dismiss();
            })

          }
        }
      ]


    });
    alert.present();
  }

  addPoi(poi: any, destination, startPoint) {
    if (!destination && !startPoint) {
      let loader = this.loadingCtrl.create();
      loader.present();
      this.visitProvider.addPoi(localStorage.getItem('visit-id'), poi._id).subscribe(res => {
        this.messageProvider.createDefaultToast(poi._source.tags.name != null ? poi._source.tags.name + " aggiunto alla visita" : "Punto d'interesse aggiunto alla visita");
        localStorage.setItem('load-visit', "true");
        loader.dismiss();
      }, err => {
        loader.dismiss();
        this.messageProvider.createDefaultToast("Errore durante l'aggiunta del punto d'interesse. Riprovare.")
      })
    } else if (destination) {
      let loader = this.loadingCtrl.create();
      loader.present();
      let endPoint: StartEndPoint = new StartEndPoint(null, null, poi._id, Number(localStorage.getItem('visit-id')));
      this.visitProvider.addEndPoint(endPoint).subscribe(() => {
        this.messageProvider.createDefaultToast(poi._source.tags.name != null ? poi._source.tags.name + " aggiunto come traguardo" : "Punto d'interesse aggiunto come traguardo");
        localStorage.setItem('load-visit', "true");
        loader.dismiss();
      }, err => {
        loader.dismiss();
        this.messageProvider.createDefaultToast("Errore durante l'aggiunta del traguardo. Riprovare.")
      })

    } else if (startPoint) {
      let loader = this.loadingCtrl.create();
      loader.present();
      let startPoint: StartEndPoint = new StartEndPoint(null, null, poi._id, Number(localStorage.getItem('visit-id')));
      this.visitProvider.addStartPoint(startPoint).subscribe(() => {
        this.messageProvider.createDefaultToast(poi._source.tags.name != null ? poi._source.tags.name + " aggiunto come punto di partenza" : "Punto d'interesse aggiunto come punto di partenza");
        localStorage.setItem('load-visit', "true");
        loader.dismiss();
      }, err => {
        loader.dismiss();
        this.messageProvider.createDefaultToast("Errore durante l'aggiunta del punto di partenza. Riprovare.")
      })
    }
  }
}
