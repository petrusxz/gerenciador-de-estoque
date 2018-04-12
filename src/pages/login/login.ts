import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';

import { UserModel } from '../../models/user.model';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  private signInForm: FormGroup;
  private user: UserModel;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder, private afAuth: AngularFireAuth,
    private toastService: ToastService, private loadingService: LoadingService) {
    this.validationForm();
  }

  validationForm(): void {
    const emailValidator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    this.signInForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.pattern(emailValidator), Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  validateFields(): void {
    if (this.signInForm.invalid)
      this.signInForm.markAsPending();
  }

  signIn(): void {
    if (!this.signInForm.valid) {
      Object.keys(this.signInForm.controls).forEach(field => {
        const control = this.signInForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      this.validateFields();
      return;
    }

    this.user = this.signInForm.value;

    this.loadingService.presentLoading();

    this.afAuth.auth.signInWithEmailAndPassword(
      this.user.email,
      this.user.password
    )
      .then((response: firebase.User) => {
        if (!response.emailVerified) {
          this.toastService.presentToast('Verificação de email pendente.');
          return;
        }

        this.loadingService.dissmissLoading();
        this.navCtrl.setRoot('HomePage');
      })
      .catch(error => {
        this.loadingService.dissmissLoading();
        this.toastService.presentToast(error.message);
      });
  }
}