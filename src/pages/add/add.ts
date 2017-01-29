import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";
import {ItemService} from "../../services/item-service";
import {Item} from "../../models/item";
import {ToastController} from "ionic-angular";

@Component({
  selector: 'page-add',
  templateUrl: 'add.html'
})
export class AddPage {

  numbers: number[] = Array.apply(null, {length: 15}).map(Number.call, Number);
  itemSuccessfullyAdded = "Elemento añadido correctamente";

  constructor(private itemService: ItemService,
              private toastCtrl: ToastController) {}

  onAddItem(form: NgForm) {
    const item = new Item(form.value.activity, form.value.eventDate, form.value.numberOfHours);
    this.itemService.addItem(item);
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
