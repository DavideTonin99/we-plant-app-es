import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActiveUserPage } from './active-user';

@NgModule({
  declarations: [
    ActiveUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ActiveUserPage),
  ],
})
export class ActiveUserPageModule {}
