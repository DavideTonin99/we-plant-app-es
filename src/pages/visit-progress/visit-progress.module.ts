import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VisitProgressPage } from './visit-progress';
import {ChartsModule} from "ng2-charts";
import {Geolocation} from "@ionic-native/geolocation";

@NgModule({
  declarations: [
    VisitProgressPage,
  ],
  imports: [
    IonicPageModule.forChild(VisitProgressPage),
    ChartsModule
  ],
  providers: [
    Geolocation
  ]
})
export class VisitProgressPageModule {}
