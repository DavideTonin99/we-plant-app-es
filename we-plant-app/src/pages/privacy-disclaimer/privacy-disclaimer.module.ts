import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivacyDisclaimerPage } from './privacy-disclaimer';

@NgModule({
  declarations: [
    PrivacyDisclaimerPage,
  ],
  imports: [
    IonicPageModule.forChild(PrivacyDisclaimerPage),
  ],
})
export class PrivacyDisclaimerPageModule {}
