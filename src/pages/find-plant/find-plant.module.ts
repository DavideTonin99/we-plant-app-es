import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindPlantPage } from './find-plant';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";

@NgModule({
  declarations: [
    FindPlantPage,
  ],
  imports: [
    IonicPageModule.forChild(FindPlantPage),
  ],
  providers: [
    BarcodeScanner
  ]
})
export class FindPlantPageModule {}
