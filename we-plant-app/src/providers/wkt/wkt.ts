import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {LatLng} from "@ionic-native/google-maps";

/*
  Generated class for the WktProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WktProvider {

  constructor(public http: HttpClient) {
    console.log('Hello WktProvider Provider');
  }


  toWkt(lat: string, lon: string) {
    return `POINT (${lon} ${lat})`
  }

  toLatLon(wkt: string):LatLng {
    let latLon: LatLng = new LatLng(0,0);
    if (!!wkt) {
      let lonLat = wkt.match(/[-]?[0-9]?[0-9].[0-9]+/g)
      if (lonLat.length >= 2) {
        latLon.lng = Number(lonLat[0])
        latLon.lat = Number(lonLat[1])
      }
    }
    return latLon;
  }
}
