import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapPage } from './map';
import {GoogleMaps} from "@ionic-native/google-maps";
import { Geolocation } from '@ionic-native/geolocation';
import {ComuneProvider} from "../../providers/comune/comune";

@NgModule({
  declarations: [
    MapPage,
  ],
  imports: [
    IonicPageModule.forChild(MapPage)
  ],
  providers: [
    GoogleMaps, Geolocation, ComuneProvider
  ]
})
export class MapPageModule {}
