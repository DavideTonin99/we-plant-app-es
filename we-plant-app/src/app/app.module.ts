import {NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {GoogleMaps} from "@ionic-native/google-maps";
import { AuthProvider } from '../providers/auth/auth';
import {ConfigProvider} from "../providers/config/config";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {InterceptorProvider} from "../providers/interceptor/interceptor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { VisitProvider } from '../providers/visit/visit';
import { CategoryProvider } from '../providers/category/category';
import { PoiProvider } from '../providers/poi/poi';
import { MessageProvider } from '../providers/message/message';
import { VisitUtilProvider } from '../providers/visit-util/visit-util';
import {Geolocation} from "@ionic-native/geolocation";
import { GeoFancingProvider } from '../providers/geo-fancing/geo-fancing';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {PouchdbProvider} from "../providers/pouchdb/pouchdb";
import { AlberoProvider } from '../providers/albero/albero';
import { ImageProvider } from '../providers/image/image';
import {GalleryModal} from "ionic-gallery-modal";
import * as ionicGalleryModal from 'ionic-gallery-modal';
import { ElasticlunrProvider } from '../providers/elasticlunr/elasticlunr';
import { WktProvider } from '../providers/wkt/wkt';
import { ComuneProvider } from '../providers/comune/comune';
import { PrivacyProvider } from '../providers/privacy/privacy';
import {PositionSelectorComponent} from "../components/position-selector/position-selector";
import {DirectivesModule} from "../directives/directives.module";
import {AndroidPermissions} from "@ionic-native/android-permissions";
import {QrScannerComponent} from "../components/qr-scanner/qr-scanner";
import {ZXingScannerModule} from "@zxing/ngx-scanner";
import {PhotoModalComponent} from "../components/photo-modal/photo-modal";
import {WebcamModule} from "ngx-webcam";

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    PositionSelectorComponent,
    QrScannerComponent,
    PhotoModalComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ionicGalleryModal.GalleryModalModule,
    DirectivesModule,
    ZXingScannerModule,
    WebcamModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    GalleryModal,
    PositionSelectorComponent,
    QrScannerComponent,
    PhotoModalComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GoogleMaps,
    AuthProvider,
    ConfigProvider,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorProvider,
      multi: true
    },
    Geolocation,
    VisitProvider,
    CategoryProvider,
    PoiProvider,
    MessageProvider,
    VisitUtilProvider,
    GeoFancingProvider,
    PouchdbProvider,
    AlberoProvider,
    ImageProvider,
    ElasticlunrProvider,
    WktProvider,
    ComuneProvider,
    PrivacyProvider,
    PrivacyProvider,
    AndroidPermissions
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}

export function createTranslateLoader(HttpClient: HttpClient) {
  return new TranslateHttpLoader(HttpClient, './assets/i18n/', '.json');
}
