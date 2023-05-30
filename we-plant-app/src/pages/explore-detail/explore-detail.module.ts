import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExploreDetailPage } from './explore-detail';

@NgModule({
  declarations: [
    ExploreDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ExploreDetailPage),
  ],
})
export class ExploreDetailPageModule {}
