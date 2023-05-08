import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ExplorPage} from './explor';
import {Geolocation} from "@ionic-native/geolocation";

@NgModule({
  declarations: [
    ExplorPage,
  ],
  imports: [
    IonicPageModule.forChild(ExplorPage),

  ],
  providers: [
    Geolocation
  ]
})
export class ExplorPageModule {
}
