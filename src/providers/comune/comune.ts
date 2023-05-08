import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";

/*
  Generated class for the ComuneProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ComuneProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ComuneProvider Provider');
  }

  getAreaVerde(lat, lon) {
/*    return new Observable(subscriber => {
      subscriber.next([{
          "CODICE": "10001",
          "DENOMINAZIONE": "Giardini di Piazza Brà",
          "TIPO_AREA": "PIAZZE",
          "NOME_VIA": "VIA GIARDINI VITTORIO EMANUELE II",
          "CIRCOSCRIZIONE": "1 CENTRO STORICO",
          "SUP_VERDE": 3370.0,
          "SUP_PAVIM": 3645.0,
          "IRRIGAZIONE": "automatico",
          "MANUTENZIONE": "A.M.I.A. S.p.A.",
          "ANNOTAZIONI": "2 monum., 1 vasca, 2 fontanelle"
        }]
      )
    })*/
        return this.http.get<string>(`https://www.api.ilmiocapitaleverde.nino.cloud/api/custom/area-verde/${lat}/${lon}`)
  }
}
