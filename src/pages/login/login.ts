import { Component } from '@angular/core';
import {NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';
import {AuthService} from "../../services/authService";
import {NgForm} from "@angular/forms";

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
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
