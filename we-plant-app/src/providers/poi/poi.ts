import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ConfigProvider} from "../config/config";
/*
  Generated class for the PoiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PoiProvider {

  constructor(public http: HttpClient,
              public configProvider: ConfigProvider) {
    console.log('Hello PoiProvider Provider');
  }

  getByType(type, key) {
    return this.http.get<Array<any>>(`${this.configProvider.nodeUrl}/poi/${type}/${key}`)
  }

  get(poiId: string) {
    return this.http.get<any>(`${this.configProvider.nodeUrl}/poi/${poiId}`)
  }
}
