import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PoiOptionsPage } from './poi-options';

@NgModule({
  declarations: [
    PoiOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(PoiOptionsPage),
  ],
})
export class PoiOptionsPageModule {}
