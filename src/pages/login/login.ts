import { Component } from '@angular/core';
import {LoadingController, AlertController} from 'ionic-angular';
import {AuthService} from "../../services/auth-service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController){}

  onLogin(form: NgForm){
    const loading = this.loadingCtrl.create({
      content: 'Signing you in...'
    });
    loading.present();
    this.authService.login(form.value.email, form.value.password)
      .then(data => {
        loading.dismiss();
      })
      .catch(error => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Sign in failed',
          message: error.message,
          buttons: ['Ok']
        });
        alert.present();
      });
  }

}
