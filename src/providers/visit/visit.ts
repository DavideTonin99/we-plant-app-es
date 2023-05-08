import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ConfigProvider} from "../config/config";
import {map, retry} from "rxjs/operators";
import {Visit} from "../../model/visit.model";
import {StartEndPoint} from "../../model/startEndPoint.model";

/*
  Generated class for the VisitProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VisitProvider {

  constructor(public http: HttpClient,
              public configProvider: ConfigProvider) {
  }

  getByUsername() {
    return this.http.get<Visit>(`${this.configProvider.serverUrl}/api/custom/visits/details/by-user/${JSON.parse(localStorage.getItem('user')).username}`).pipe(map(value => {
      localStorage.removeItem('load-visit')
      return value;
    }))
  }

  create() {
    return this.http.post<Visit>(`${this.configProvider.serverUrl}/api/custom/visits`, {}).pipe(retry(2));
  }

  update(visit: Visit) {
    return this.http.put<Visit>(`${this.configProvider.serverUrl}/api/custom/visits`, visit);
  }

  addPoi(visitId: string, poiId) {
    let stop = {
      "poiId": poiId,
      "reached": false,
      "stopType": "REGULAR",
      "visitId": visitId
    }
    return this.http.post<any>(`${this.configProvider.serverUrl}/api/custom/stops`, stop).pipe(retry(2));
  }

  removePoi(poiId) {
    return this.http.delete<any>(`${this.configProvider.serverUrl}/api/custom/stops/${poiId}`);
  }

  updateCurrentPosition(latitude: number, longitude: number, id) {
    let visit = new Visit();
    visit.id = id;
    visit.lastLat = latitude;
    visit.lastLon = longitude;
    return this.http.put<any>(`${this.configProvider.serverUrl}/api/custom/visits/current-position`, visit)
  }

  startVisit(visitId: number, lat, lon) {
    let startVisit = {
      "id": visitId,
      "lat": lat,
      "lon": lon,
      "reset": false
    }
    return this.http.post<any>(`${this.configProvider.serverUrl}/api/custom/visits/start`, startVisit)
  }

  reached(stop) {
    return this.http.post<any>(`${this.configProvider.serverUrl}/api/custom/visits/stop/reached`, stop)
  }

  addStartPoint(startPoint: StartEndPoint) {
    return this.http.post<any>(`${this.configProvider.serverUrl}/api/custom/visits/start-point`, startPoint);
  }

  addEndPoint(endPoint: StartEndPoint) {
    return this.http.post<any>(`${this.configProvider.serverUrl}/api/custom/visits/end-point`, endPoint);
  }

  removeStartPoint(visitId) {
    return this.http.delete<any>(`${this.configProvider.serverUrl}/api/custom/visits/start-point/${visitId}`);

  }

  removeEndPoint(visitId) {
    return this.http.delete<any>(`${this.configProvider.serverUrl}/api/custom/visits/end-point/${visitId}`);

  }
}
