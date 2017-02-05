import { Component } from '@angular/core';
import {LoadingController, AlertController, NavController} from 'ionic-angular';
import {AuthService} from "../../services/auth-service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private navCtrl: NavController){}

  onLogin(form: NgForm){
    const loading = this.loadingCtrl.create({
      content: 'Autenticándote...'
    });
    loading.present();
    this.authService.login(form.value.email, form.value.password)
      .then(data => {
        loading.dismiss();
        this.navCtrl.popToRoot();
      })
      .catch(error => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Hubo un problema de autenticación...',
          message: error.message,
          buttons: ['Ok']
        });
        alert.present();
      });
  }

}
