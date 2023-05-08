import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {PasswordValidation} from '../../vaidators/password-validation/password-validation';
import {AuthProvider} from '../../providers/auth/auth';
import {TranslateService} from '@ngx-translate/core';
import {PrivacyProvider} from "../../providers/privacy/privacy";
import {JhUserModel} from "../../model/jhUser-model";
function emailDomainValidator(control: FormControl) {
  let email = control.value;
  if (email && email.indexOf("@") != -1) {
    let [_, domain] = email.split("@");
    if (!domain.includes("univr.it") && !domain.includes("amiavr.it") && !domain.includes("comune.verona.it")) {
      return {
        emailDomain: {
          parsedDomain: domain
        }
      }
    }
  }
  return null;
}

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  signupSuccessMsg: string;
  genericError: string;
  emailInUseError: string;
  submitAttempt;
  signupForm;
  privacyOn;
  privacyOff;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              formBuilder: FormBuilder,
              public authProvider: AuthProvider,
              public toastCtrl: ToastController,
              translateService: TranslateService,
              private loadingCtl: LoadingController,
              private privacyProvider: PrivacyProvider) {
    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email],)],
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      confirmPassword: ['', Validators.compose([Validators.required])],
    }, {
      validator: PasswordValidation.MatchPassword
    });
    translateService.get('SIGNUP.EMAIL_IN_USE').subscribe((res: string) => {
      this.emailInUseError = res
    });
    translateService.get('SIGNUP.GENERIC_ERROR').subscribe((res: string) => {
      this.genericError = res
    });
    translateService.get('SIGNUP.SUCCESS').subscribe((res: string) => {
      this.signupSuccessMsg = res
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  requiredFields() {
    return this.signupForm.controls.email.errors.required || this.signupForm.controls.username.errors.required || this.signupForm.controls.password.errors.required || this.signupForm.controls.confirmPassword.errors.required
  }

  signup() {
    console.log(this.signupForm.controls.email.errors)
    this.submitAttempt = true;
    if (this.signupForm.valid) {
      let loading = this.loadingCtl.create();
      loading.present();
      this.authProvider.signUp(this.signupForm.controls.email.value, this.signupForm.controls.firstName.value, this.signupForm.controls.lastName.value, 'IT', this.signupForm.controls.password.value, true)
        .subscribe((result: JhUserModel) => {
          loading.dismiss();
          let toast = this.createToast(this.signupSuccessMsg, 15000)
          toast.present();
          toast.onDidDismiss(() => {
            this.navCtrl.setRoot('ActiveUserPage');
          });
        }, error => {
          loading.dismiss();
          let toast = this.createToast(error.error.errorKey === "userexists" ? this.emailInUseError : this.genericError, 3000)
          toast.present();
        });
    }
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

  insertKey() {
    this.navCtrl.push("ActiveUserPage");
  }

  updatePrivacyOn() {
    this.privacyOn = true;
    this.privacyOff = false;
  }

  updatePrivacyOff() {
    this.privacyOff = true;
    this.privacyOn = false;
  }
}
