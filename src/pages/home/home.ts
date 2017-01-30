import {Component} from '@angular/core';

import {AddPage} from "../add/add";
import {ItemService} from "../../services/item-service";
import {Item} from "../../models/item";
import {FilterPage} from "../filter/filter";
import {
  ModalController, ToastController, LoadingController, PopoverController, AlertController,
  Loading
} from "ionic-angular";
import {RemovePage} from "../remove/remove";
import {SaveOptionsPage} from "../save-options/save-options";
import {AuthService} from "../../services/auth-service";

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
              private toastCtrl: ToastController,
              private loadCtrl: LoadingController,
              private popoverCtrl: PopoverController,
              private authService: AuthService,
              private alertCtrl: AlertController) {}

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

  onDisplayOptions(event) {
    const loading = this.loadCtrl.create({
      content: 'Espera por favor'
    });
    const popover = this.popoverCtrl.create(SaveOptionsPage);
    popover.present({
      ev: event
    });

    popover.onDidDismiss(
      data => {
        //when clicking outside of the popover
        if(!data){
          return;
        }
        if(data.action == 'load'){
          this.saveItems(loading);
        } else if(data.action == 'store') {
          this.persistItems(loading);
        }
      }
    );

  }

  private saveItems(loading: Loading) {
    loading.present();
    this.authService.getActiveUser().getToken()
      .then(
        (token: string) => {
          this.itemService.fetchItems(token)
            .subscribe(
              (list: Item[]) => {
                if (list) {
                  this.items = list;
                } else {
                  this.items = [];
                }
                loading.dismiss();
              },
              error => {
                loading.dismiss();
                this.handleError(error.json().error);
              }
            );
        }
      )
      .catch()
  }

  private persistItems(loading: Loading) {
    loading.present();
    this.authService.getActiveUser().getToken()
      .then(
        (token: string) => {
          this.itemService.persistItems(token)
            .subscribe(
              () => loading.dismiss(),
              error => {
                this.handleError(error.json().error)
              }
            );
        }
      )
      .catch()
  }


  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occurred',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }
}
