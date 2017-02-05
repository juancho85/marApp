import { Component } from '@angular/core';
import {LoadingController, AlertController} from 'ionic-angular';
import {AuthService} from "../../services/auth-service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  constructor(private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {}

  onSignup(form: NgForm){
    const loading = this.loadingCtrl.create({
      content: 'Registrándote...'
    });
    loading.present();
    this.authService.signup(form.value.email, form.value.password)
      .then(data => {
        loading.dismiss();
      })
      .catch(error => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Fallo de registro',
          message: error.message,
          buttons: ['Ok']
        });
        alert.present();
      });
  }

}
