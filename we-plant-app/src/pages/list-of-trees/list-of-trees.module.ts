import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ListOfTreesComponent } from './list-of-trees';

@NgModule({
  declarations: [
    ListOfTreesComponent,
  ],
  imports: [
    IonicPageModule.forChild(ListOfTreesComponent)
  ],
  exports: [
    ListOfTreesComponent,
  ]
})
export class ListOfTreesComponentModule {}
