import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import {ItemService} from "../../services/item-service";
import {Item} from "../../models/item";
import {ToastController} from "ionic-angular";
import {AuthService} from "../../services/auth-service";

@Component({
  selector: 'page-add',
  templateUrl: 'add.html'
})
export class AddPage {

  numbers: number[] = Array.apply(null, {length: 15}).map(Number.call, Number);
  itemSuccessfullyAdded = "Elemento añadido correctamente";
  itemUnsuccessfullyAdded = "El elemento no pudo ser añadido";

  constructor(private itemService: ItemService,
              private toastCtrl: ToastController,
              private authService: AuthService) {}

  onAddItem(form: NgForm) {
    this.authService.getActiveUser().getToken()
      .then((token: string) => {
        const item = new Item(form.value.activity, form.value.eventDate, form.value.numberOfHours, null);
        this.itemService.addItem(item, token).subscribe((data) => {
          if(!data) {
            this.showToast(this.itemUnsuccessfullyAdded);
          }
        });
      })
      .catch((error)=>{
        console.error("could not get token", error);
        this.showToast(this.itemUnsuccessfullyAdded);
      });

    this.showToast(this.itemSuccessfullyAdded);
  }

  showToast(message: string){
    const toast = this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }

}
