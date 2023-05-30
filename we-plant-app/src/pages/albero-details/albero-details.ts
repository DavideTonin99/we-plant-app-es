import {Component, NgZone} from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController, Modal,
  ModalController,
  NavController,
  NavParams, Platform,
  ToastController
} from 'ionic-angular';
import {Albero, Essenza} from "../../model/albero.model";
import {AlberoProvider} from "../../providers/albero/albero";
import {DatePipe} from "@angular/common";
import {ImageModel} from "../../model/image";
import {Camera, CameraOptions} from '@ionic-native/camera';
import {File} from "@ionic-native/file";
import {FileTransferObject} from "@ionic-native/file-transfer";
import {ConfigProvider} from "../../providers/config/config";
import {ImageProvider} from "../../providers/image/image";
import _ from "lodash";
import {GalleryModal} from "ionic-gallery-modal";
import {Geolocation} from "@ionic-native/geolocation";
import {ElasticlunrProvider} from "../../providers/elasticlunr/elasticlunr";
import {ComuneProvider} from "../../providers/comune/comune";
import {AlberoVisit} from "../../model/albero-visit.model";
import {AuthProvider} from "../../providers/auth/auth";
import {PositionSelectorComponent} from "../../components/position-selector/position-selector";
import {ILatLng} from "@ionic-native/google-maps";
import {QrScannerComponent} from "../../components/qr-scanner/qr-scanner";
import {PhotoModalComponent} from "../../components/photo-modal/photo-modal";
import {Observable} from "rxjs/Observable";
import {forkJoin} from "rxjs/observable/forkJoin";

declare var navigator: any;

/**
 * Generated class for the AlberoDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-albero-details',
  templateUrl: 'albero-details.html',
})
export class AlberoDetailsPage {

  display = 'block'
  albero: Albero;
  clearDataImpianto: any = {
    buttons: [{
      text: 'Clear',
      handler: () => {
        this.albero.dataImpianto = null;
      }
    }]
  }
  clearDataPrimaRilevazione: any = {
    buttons: [{
      text: 'Clear',
      handler: () => {
        this.albero.dataPrimaRilevazione = null;
      }
    }]
  }
  clearDataAbattimento: any = {
    buttons: [{
      text: 'Clear',
      handler: () => {
        this.albero.dataAbbattimento = null;
      }
    }]
  }
  dataUltimoAggiornamento;
  options: CameraOptions;
  images: Array<ImageModel> = [];
  imagesInCache: Array<any> = [];
  newAlbero = false;
  initLat;
  lat;
  initLon;
  lon;
  initWkt;
  searchBar;
  searching = false;
  toComplite = false;
  anonimusUser = false;
  isCurrentUserAdmin;
  currentUser;
  private essenzaSearchResult: Array<Essenza> = [];
  private modal: Modal;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alberoProvider: AlberoProvider,
              public alertCtrl: AlertController,
              private datePipe: DatePipe,
              private camera: Camera,
              private file: File,
              private ngZone: NgZone,
              private loadingCtrl: LoadingController,
              private fileTransfer: FileTransferObject,
              private configProvider: ConfigProvider,
              private imageProvider: ImageProvider,
              private modalCtrl: ModalController,
              private geolocation: Geolocation,
              public lunrProvider: ElasticlunrProvider,
              public comuneProvider: ComuneProvider,
              public toastCtrl: ToastController,
              public authProvider: AuthProvider,
              public platform: Platform) {


    this.anonimusUser = this.authProvider.isAnonimusUser();
    this.isCurrentUserAdmin = this.authProvider.isCurrentUserAdmin();
    let alberoJSON = sessionStorage.getItem('albero');
    let albero = !!alberoJSON ? JSON.parse(alberoJSON) : null;
    this.toComplite = !!this.navParams.get("toComplite");
    this.platform.registerBackButtonAction(() => {
      if (!!this.modal) {
        this.modal.dismiss();
      } else {
        this.navCtrl.pop();
      }
    })
    this.authProvider.currentUser().subscribe(res => {
      console.log(res.data)
      this.currentUser = res.data
    })
    if (!albero) {
      this.newAlbero = true;
      this.albero = new Albero();
      this.initLat = !!this.lat ? this.lat : null;
      this.initLon = !!this.lon ? this.lon : null;
      this.albero.dataPrimaRilevazione = this.albero.dataPrimaRilevazione = datePipe.transform(new Date(), 'yyyy-MM-dd');
    } else {
      this.albero = new Albero();
      let loader = this.loadingCtrl.create();
      loader.present();

      this.alberoProvider.find(albero.id).subscribe(res => {
        loader.dismiss();
        this.albero = res;
        this.loadImages();
        this.dataUltimoAggiornamento = datePipe.transform(this.albero.dataUltimoAggiornamento, 'dd-MM-yyyy HH:mm');
        this.wkLonLat();
        this.initLat = !!this.lat ? this.lat : null;
        this.initLon = !!this.lon ? this.lon : null;
        if (!!this.lat && !!this.lon) {
          this.initWkt = `POINT (${this.lon} ${this.lat})`;
        }
      }, err => {
        loader.dismiss();
      })

      if (!!albero.id) {
        let alberoVisit = new AlberoVisit();
        alberoVisit.alberoId = albero.id;
        this.alberoProvider.alberoVisit(alberoVisit).subscribe(res => {
        }, err => {
          console.log(err)
        })
      }
    }


    this.options = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 700,
      targetHeight: 700,
    };
    if (_.isNil(lunrProvider.essenzaIndex)) {
      let loader = this.loadingCtrl.create();
      loader.present();
      this.alberoProvider.essenzaList().subscribe(res => {
        lunrProvider.initEssenza(res)
        loader.dismiss();
      }, err => {
        loader.dismiss();
      })
    }

    console.log(this.albero);
  }

  ionViewDidLoad() {
    this.imagesInCache = [];
  }

  ionViewDidLeave() {
    this.clearData();
  }

  checkAndSave() {
    console.log(this.albero)
    if (this.toComplite) {
      if (!this.albero.idPianta) {
        this.alertCtrl.create({message: "codice albero non inserita!", buttons: [{text: "ok"}]}).present();
        return;
      }
      this.alberoProvider.checkIdPianta(this.albero.idPianta).subscribe(res => {
        if (!res) {
          this.alertCtrl.create({message: "codice albero già utilizzato!", buttons: [{text: "ok"}]}).present();
          return;
        } else {
          this.save();
        }
      }, err => {
        this.alertCtrl.create({
          message: "Non è stato possibile verificare il codice albero!",
          buttons: [{text: "ok"}]
        }).present();
      })
    } else {
      if (this.newAlbero) {
        if (!this.albero.essenza.id) {
          this.alertCtrl.create({message: "Genere e specie non selezionato!", buttons: [{text: "ok"}]}).present();
          return;
        }
        if (!this.albero.wkt) {
          this.alertCtrl.create({message: "Coordinate geografiche non inserite!", buttons: [{text: "ok"}]}).present();
          return;
        }
        if (!this.albero.idPianta) {
          this.alertCtrl.create({message: "Codice albero non inserito!", buttons: [{text: "ok"}]}).present();
          return;
        }
      }
      this.save();

    }

  }

  tackPicture() {

    let modal = this.modalCtrl.create(PhotoModalComponent, {modal: this})
    modal.present();
    modal.onDidDismiss((data) => {
      console.log(data);
      this.processPicture(data.imageAsDataUrl);
    });
    /*
    this.alertCtrl.create({
      message: "Da dove vuoi allegare la foto?", buttons: [
        {
          text: "Galleria",
          handler: () => {
            this.options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
            this.camera.getPicture(this.options).then((fileURI) => {
              this.processPicture(fileURI);
            }, (err) => {
              // Handle error
            });
          }
        },
        {
          text: "Fotocamera",
          handler: () => {
            this.options.sourceType = this.camera.PictureSourceType.CAMERA;
            this.camera.getPicture(this.options).then((fileURI) => {
              this.processPicture(fileURI);
            }, (err) => {
              // Handle error
            });
          }
        }
      ]
    }).present();*/
  }

  clearData() {
    this.removeCachedImages();
    this.images = [];
  }

  loadImages() {
    this.albero.images.forEach(res => {
      console.log(res);
      let image = new ImageModel(`${this.configProvider.serverUrl}/api/custom/images/path/${res.id}`);
      image.thumbnailUrl = `${this.configProvider.serverUrl}/api/custom/images/path/thumbnail/${res.id}`;
      image.id = res.id;
      image.cratedById = res.cratedById;
      this.images.push(image);
    })
  }

  removeCachedImages() {
    this.imagesInCache.forEach(image => {
      this.file.removeFile(this.file.cacheDirectory, image.name).then(value => {
        console.log('file deleted: ', value)
      }, reason => {
        console.log('cannot delete file')
      })
    })
  }

  isReadOnly() {
    return this.anonimusUser
  }

  deletePhoto(imageToDelete: ImageModel) {
    if (!!imageToDelete.id) {
      let loader = this.loadingCtrl.create();
      loader.present();
      this.imageProvider.delete(imageToDelete.id).subscribe(res => {
        loader.dismiss();
        this.removeImageFromView(imageToDelete.url);
        this.alertCtrl.create({message: `Immagine cancellata con successo`, buttons: [{text: "ok"}]}).present();
      }, err => {
        loader.dismiss();
        this.alertCtrl.create({message: `Errore durante la cancellazione `, buttons: [{text: "ok"}]}).present();
      })
    } else {
      this.removeImageFromView(imageToDelete.url)
    }
  }

  mapPositionCallbackFunction = (res: ILatLng) => {
    return new Promise((resolve, reject) => {
      console.log('myCallbackFunction');
      console.log(res);
      if (!!res && !!res.lng && !!res.lat) {
        this.lat = res.lat
        this.lon = res.lng
        this.albero.wkt = `POINT (${this.lon} ${this.lat})`
      } else {
        this.toastCtrl.create({
          position: 'top',
          message: 'Non è stato possibile rilevare le coordinate',
          showCloseButton: true,
          closeButtonText: 'chiudi',
          duration: 3000
        }).present()
      }
      resolve();
    });
  }

  getCurrentLocation() {
    let loader = this.loadingCtrl.create();
    loader.present();

    navigator.geolocation.getCurrentPosition((success) => {
      console.log(success.coords.latitude)
      console.log(success.coords.longitude)
      this.lon = success.coords.longitude;
      this.lat = success.coords.latitude;
      this.albero.wkt = `POINT (${this.lon} ${this.lat})`
      loader.dismiss();

    }, (error) => {
      console.log(error)
      this.toastCtrl.create({
        position: 'top',
        message: 'Non è stato possibile rilevare le coordinate',
        showCloseButton: true,
        closeButtonText: 'chiudi',
        duration: 3000
      }).present()
      loader.dismiss();
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
    /*navigator.permissions.query({name: 'geolocation'}).then((result) => {
      console.log(result.state === 'granted');
      if (result.state === 'granted') {
      }else {
        loader.dismiss();
        this.toastCtrl.create({
          position: 'top',
          message: 'Non sono stati concessi permessi di accesso alla posizione',
          showCloseButton: true,
          closeButtonText: 'chiudi',
          duration: 3000
        }).present()
      }
    });*/
    /*
    this.display = 'none';
    let modal = this.modalCtrl.create(PositionSelectorComponent, {modal: this});
        modal.present();
        modal.onDidDismiss((res: ILatLng) => {
          this.display = 'block';
          if(!!res && !!res.lng && !!res.lat){
            this.lat = res.lat
            this.lon = res.lng
            this.albero.wkt = `POINT (${this.lon} ${this.lat})`
          }
        })*/
  }

  removeImageFromView(url) {
    this.images = _.filter(this.images, function (image) {
      return image.url !== url;
    });
  }

  openGallery(index: number) {
    this.modal = this.modalCtrl.create(GalleryModal, {
      photos: this.images,
      initialSlide: index
    });
    this.modal.present();
    this.modal.onDidDismiss(res => {
      this.modal = null;
    })
  }

  inputChange(searchBar) {
    if (!!searchBar) {
      this.searching = true;
      this.albero.essenza = new Essenza();
      this.albero.essenzaId = null;
      let searchResult = this.lunrProvider.searchEssenza(this.searchBar);
      this.essenzaSearchResult = [];
      searchResult.forEach(res => {
        this.essenzaSearchResult.push(this.lunrProvider.getEsssenzaById(res.ref))
      })
    } else {
      this.searching = false;
      this.essenzaSearchResult = [];
    }
    console.log(searchBar);
  };

  onSearchBlur() {
    setTimeout(() => {
      this.searching = false;
    }, 0)
  }

  selectedEssenza(essenza: Essenza) {
    console.log(essenza);
    let loader = this.loadingCtrl.create();
    loader.present();
    this.alberoProvider.getEssenzaAudit(essenza.id).subscribe(res => {
      loader.dismiss();
      this.albero.essenza = res;
      this.albero.essenza.id = essenza.id;
      this.albero.essenzaId = essenza.id;
      this.searchBar = res.genereESpecie;
      this.searching = false;
    }, err => {
      loader.dismiss();
      this.albero.essenza = essenza;
      this.albero.essenzaId = essenza.id;
      this.searchBar = essenza.genereESpecie;
      this.searching = false;
    })

  }

  clearLocation() {
    this.ngZone.run(res => {
      this.lat = this.initLat;
      this.lon = this.initLon;
      this.albero.wkt = this.initWkt;
    })
  }

  getThumbnailOrImage(image: ImageModel) {
    return image.url
  }

  deleteAlbero() {
    this.alertCtrl.create({
      message: 'Sicuro di voler eliminare l\'albero?',
      buttons: [
        {
          text: 'Si, elimina', handler: () => {
            this.albero.deleted = true;
            this.save();
          }
        }, {
          text: 'No, non eliminare'
        }]
    }).present();
  }

  recoverAlbero() {
    this.albero.deleted = false;
    this.save()
  }

  canDeleteImage(image: ImageModel) {
    console.log(this.isCurrentUserAdmin)
    if (!this.currentUser || this.anonimusUser) {
      return false;
    }
    if (!!image.toUpload) {
      return true;
    }
    return this.currentUser.id == image.cratedById || this.isCurrentUserAdmin;
  }

  private save() {
    const loader = this.loadingCtrl.create();
    loader.present();
    this.normalizeDates();
    this.alberoProvider.updateAlberoAndEssenza(this.albero).subscribe(res => {
      this.albero = res;
      this.newAlbero = false;
      let options = {
        mimeType: "multipart/form-data",
        params: {'entityType': 'ALBERO', 'id': this.albero.mainId, imageName: ''},
        chunkedMode: false,
        headers: {Authorization: localStorage.getItem("user-token")}
      };
      let imageUpload$ = [];
      if (!this.images || !this.images.length) {
        loader.dismiss();
      }
      this.images.forEach(image => {
        if (!image.id) {
          options.params.imageName = image.name;
          console.log(`file to upload : ${image.name}`)
          let upload$ = this.alberoProvider.uploadAlberoImage(image.url, this.albero.mainId, image.name);
          imageUpload$.push(upload$);
          //imageUploadPromise.push(this.fileTransfer.upload(image.url, `${this.configProvider.serverUrl}/api/custom/images/upload`, options));
        }
      })
      forkJoin(imageUpload$).subscribe(res => {
        if (!!this.albero.idPianta) {
          this.alberoProvider.findByIdPianta(this.albero.idPianta).subscribe(res => {
            this.clearData();
            loader.dismiss();
            this.albero = res;
            this.loadImages();
            this.alertCtrl.create({message: "Salvataggio riuscito con successo", buttons: [{text: "Ok"}]}).present();
          }, err => {
            loader.dismiss();
            this.alertCtrl.create({message: "Salvataggio riuscito con successo", buttons: [{text: "Ok"}]}).present();
          })
        } else {
          loader.dismiss();
          this.alertCtrl.create({message: "Salvataggio riuscito con successo", buttons: [{text: "Ok"}]}).present();
        }
      }, err => {
        console.log(err);
        loader.dismiss();
        this.clearData();
        this.alertCtrl.create({
          message: "Errore durante il salvataggio dei dati. Riprovare più tardi.",
          buttons: [{text: "Ok"}]
        }).present();
      })
    }, err => {
      loader.dismiss();
      this.alertCtrl.create({
        message: "Errore durante il salvataggio dei dati. Riprovare più tardi.",
        buttons: [{text: "Ok"}]
      }).present();
    })
  }

  private wkLonLat() {
    if (!!this.albero.wkt) {
      let lonLat = this.albero.wkt.match(/[-]?[0-9]?[0-9].[0-9]+/g)
      if (lonLat.length >= 2) {
        this.lon = lonLat[0]
        this.lat = lonLat[1]
      }
    }
  }

  private processPicture(fileURI: string) {
    let name = `tmp-${new Date().getTime()}.jpg`;
    let photoTest = new ImageModel(fileURI);
    this.ngZone.run(args => {
      let photo = new ImageModel(fileURI);
      photo.name = name;
      photo.toUpload = true;
      this.images.push(photo);
      this.imagesInCache.push({url: fileURI, name: name});
    })
  }


  private normalizeDates() {
    //'2019-06-25T14:20:16.681+02:00'
    this.albero.dataPrimaRilevazione = !!this.albero.dataPrimaRilevazione ? this.datePipe.transform(this.albero.dataPrimaRilevazione, 'yyyy-MM-ddTHH:mm:ss+02:00') : this.albero.dataPrimaRilevazione
    this.albero.dataAbbattimento = !!this.albero.dataAbbattimento ? this.datePipe.transform(this.albero.dataAbbattimento, 'yyyy-MM-ddTHH:mm:ss+02:00') : this.albero.dataAbbattimento
    this.albero.dataImpianto = !!this.albero.dataImpianto ? this.datePipe.transform(this.albero.dataImpianto, 'yyyy-MM-ddTHH:mm:ss+02:00') : this.albero.dataImpianto
    this.albero.dataUltimoAggiornamento = !!this.albero.dataUltimoAggiornamento ? this.datePipe.transform(this.albero.dataUltimoAggiornamento, 'yyyy-MM-ddTHH:mm:ss+02:00') : this.albero.dataUltimoAggiornamento
  }

  /*  formataNumero(e: any, separador: string = '.', decimais: number = 2) {
      let a:any = e.value.split('');
      let ns:string = '';
      a.forEach((c:any) => { if (!isNaN(c)) ns = ns + c; });
      ns = parseInt(ns).toString();
      if (ns.length < (decimais+1)) { ns = ('0'.repeat(decimais+1) + ns); ns = ns.slice((decimais+1)*-1); }
      let ans = ns.split('');
      let r = '';
      for (let i=0; i < ans.length; i++) if (i == ans.length - decimais) r = r + separador + ans[i]; else r = r + ans[i];
      e.value = r;
    }*/
  scan() {
    let modal = this.modalCtrl.create(QrScannerComponent, {modal: this})
    modal.present();
    modal.onDidDismiss((barcodeData) => {
      console.log('Barcode data', barcodeData);
      debugger;
      if (!_.isEmpty(barcodeData)) {
        barcodeData = barcodeData.replace(this.configProvider.qrCodePrefix, '');
        this.albero.idPianta = barcodeData;
      }
    });
  }
}
