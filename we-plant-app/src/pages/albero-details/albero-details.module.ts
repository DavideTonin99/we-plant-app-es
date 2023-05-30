import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlberoDetailsPage } from './albero-details';
import {DatePipe} from "@angular/common";
import {Camera} from "@ionic-native/camera";
import {File} from "@ionic-native/file";
import {FileTransferObject} from "@ionic-native/file-transfer";
import * as ionicGalleryModal from 'ionic-gallery-modal';
import {HAMMER_GESTURE_CONFIG} from "@angular/platform-browser";
import {Geolocation} from "@ionic-native/geolocation";
import {ElasticlunrProvider} from "../../providers/elasticlunr/elasticlunr";

@NgModule({
  declarations: [
    AlberoDetailsPage
  ],
  imports: [
    IonicPageModule.forChild(AlberoDetailsPage)
  ],
  providers: [
    DatePipe,
    Camera,
    File,
    FileTransferObject,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: ionicGalleryModal.GalleryModalHammerConfig,
    },
    Geolocation,
    ElasticlunrProvider
  ]
})
export class AlberoDetailsPageModule {}
