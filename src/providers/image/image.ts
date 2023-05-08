import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ConfigProvider} from "../config/config";

/*
  Generated class for the ImageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImageProvider {

  constructor(public http: HttpClient, private configProvider: ConfigProvider) {
  }

  delete(id: number) {
    return this.http.delete(`${this.configProvider.serverUrl}/api/custom/images/${id}`)
  }
}
