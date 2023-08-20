import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindPlantPage } from './find-plant';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import { ListOfTreesComponentModule } from '../list-of-trees/list-of-trees.module';

@NgModule({
  declarations: [
    FindPlantPage,
  ],
  imports: [
    IonicPageModule.forChild(FindPlantPage),
    ListOfTreesComponentModule
  ],
  providers: [
    BarcodeScanner
  ]
})
export class FindPlantPageModule {}
