import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VisitPage } from './visit';
import {Geolocation} from "@ionic-native/geolocation";

@NgModule({
  declarations: [
    VisitPage,
  ],
  imports: [
    IonicPageModule.forChild(VisitPage),
  ],
  providers: [
    Geolocation
  ]
})
export class VisitPageModule {}
