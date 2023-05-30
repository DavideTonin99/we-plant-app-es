import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigProvider {

  public serverUrl = "http://localhost:8080"
  public nodeUrl = "http://localhost:3000"
  public qrCodePrefix = "https://maven/#/intro?plant-id="

  userToken: string;
  initalDate: string = "2000-01-01T06:00:00+02:00";
  project = "WE-PLANT";

  constructor(public http: HttpClient) {
  }

}
