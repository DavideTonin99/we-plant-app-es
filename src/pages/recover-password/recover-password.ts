import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {FormBuilder, Validators} from '@angular/forms';
import {PasswordValidation} from '../../vaidators/password-validation/password-validation';
import {AuthProvider} from '../../providers/auth/auth';
import {TranslateService} from '@ngx-translate/core';

/**
 * Generated class for the RecoverPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recover-password',
  templateUrl: 'recover-password.html',
})
export class RecoverPasswordPage {
  resetError: string;
  resetSuccess: any;
  recoverError: any;
  recoverSuccess: any;
  resetAttempt: boolean;
  submitAttempt: boolean;
  recoverForm;
  resetForm;
  step: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder,
              public authProvider: AuthProvider, public toastCtrl: ToastController, translateService: TranslateService) {
    translateService.get('RECOVERPASSWORD.GENERIC_ERROR').subscribe((res: string) => {
      this.recoverError = res
    });
    translateService.get('RECOVERPASSWORD.SUCCESS').subscribe((res: string) => {
      this.recoverSuccess = res
    });
    translateService.get('RECOVERPASSWORD.RESET').subscribe((res: string) => {
      this.resetSuccess = res
    });
    translateService.get('RECOVERPASSWORD.RESET_ERROR').subscribe((res: string) => {
      this.resetError = res
    });
    this.step = 1;
    this.recoverForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
    });
    this.resetForm = formBuilder.group({
      resetCode: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      confirmPassword: ['', Validators.compose([Validators.required])],
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  ionViewDidLoad() {
  }

  insertKey() {
    this.step = 2;
  }

  passwordConfirmCheck() {
  }

  recoverPassword() {
    this.submitAttempt = true;
    if (this.recoverForm.valid) {
      this.authProvider.initResetPassword(this.recoverForm.controls.email.value)
        .subscribe(res => {
          let toast = this.createToast(this.recoverSuccess, 5000)
          toast.present();
          toast.onDidDismiss(() => {
            this.step = 2;
          });
        }, res => {
          let toast = this.createToast(this.recoverError, 5000)
          toast.present();
        })
    }
  }

  resetPassword() {
    this.resetAttempt = true;
    if (this.resetForm.valid) {
      this.authProvider.finishResetPassword(this.resetForm.controls.resetCode.value,
        this.resetForm.controls.password.value).subscribe(
        res => {
          let toast = this.createToast(this.resetSuccess, 5000)
          toast.present();
          toast.onDidDismiss(() => {
            this.navCtrl.setRoot('LoginPage');
          });
        }, error => {
          let toast = this.createToast(this.resetError, 5000)
          toast.present();
        })
    }

    console.log(this.resetForm.controls.confirmPassword.errors);
  }

  createToast(message: string, duration: number) {
    return this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: "ok"
    });
  }
}
