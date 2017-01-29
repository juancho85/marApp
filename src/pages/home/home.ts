import {Component} from '@angular/core';

import {AddPage} from "../add/add";
import {ItemService} from "../../services/item-service";
import {Item} from "../../models/item";
import {FilterPage} from "../filter/filter";
import {ModalController, ToastController} from "ionic-angular";
import {RemovePage} from "../remove/remove";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  addPage = AddPage;
  filterPage = FilterPage;

  items: Item[] = [];

  constructor(private itemService: ItemService,
              private modalCtrl: ModalController,
              private toastCtrl: ToastController) {}

  ionViewWillEnter(): void {
    this.items = this.itemService.getItems();
  }

  onDelete(item: Item, index: number) {
    const modal = this.modalCtrl.create(RemovePage, {
      item: item,
      index: index
    });
    modal.present();
    modal.onDidDismiss((didRemove: boolean) => {
      if(didRemove){
        this.itemService.deleteItem(index);
        //update the local reference
        this.items.splice(index, 1);
        this.showToast("Elemento borrado");
      }
    })
  }

  private showToast(message: string){
    const toast = this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }

}
