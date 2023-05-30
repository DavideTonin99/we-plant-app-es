import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {PrivacyModel} from "../../model/privacy.model";
import {ConfigProvider} from "../config/config";

/*
  Generated class for the PrivacyProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PrivacyProvider {

  constructor(public http: HttpClient,
              public configProvider: ConfigProvider) {
  }

  save(privacy: PrivacyModel) {
    return this.http.post(`${this.configProvider.serverUrl}/api/custom/privacies`, privacy)
  }

  consentPrivacyAndActiveUser(email) {
    return this.http.post(`${this.configProvider.serverUrl}/api/custom/privacies/by-email-and-active-user?email=${email}`, {})
  }
}
