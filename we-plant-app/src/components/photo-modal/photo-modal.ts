import { Component } from '@angular/core';
import {NavController, ViewController} from "ionic-angular";
import {WebcamImage, WebcamInitError, WebcamUtil} from "ngx-webcam";
import {Subject} from "rxjs";
import {Observable} from "rxjs/Rx";

/**
 * Generated class for the PhotoModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'photo-modal',
  templateUrl: 'photo-modal.html'
})
export class PhotoModalComponent {

  text: string;

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController) {
    this.camHeigth = 400;
    console.log('Hello PhotoModalComponent Component');
    this.text = 'Hello World';
  }

  closeModal(){
    this.viewCtrl.dismiss(null);
  }

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = false;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
    facingMode: { ideal: 'environment' }
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
  camHeigth: any;

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    this.viewCtrl.dismiss(this.webcamImage);

  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }


}
