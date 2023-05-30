import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PoiPage } from './poi';
import {ChartsModule} from "ng2-charts";

@NgModule({
  declarations: [
    PoiPage,
  ],
  imports: [
    IonicPageModule.forChild(PoiPage),
    ChartsModule
  ],
})
export class PoiPageModule {}
