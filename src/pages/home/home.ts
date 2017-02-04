import {Component} from '@angular/core';

import {AddPage} from "../add/add";
import {ItemService} from "../../services/item-service";
import {Item} from "../../models/item";
import {FilterPage} from "../filter/filter";
import {
  ModalController, ToastController, LoadingController, PopoverController, AlertController,
  Loading, NavController
} from "ionic-angular";
import {RemovePage} from "../remove/remove";
import {SaveOptionsPage} from "../save-options/save-options";
import {AuthService} from "../../services/auth-service";
import {LoginPage} from "../login/login";

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
              private alertCtrl: AlertController,
              private navCtrl: NavController) {}

  ionViewWillEnter(): void {
    this.items = this.itemService.getItems();
    if (this.items.length == 0) {
      const activeUser =  this.authService.getActiveUser();
      if(activeUser){
        activeUser.getToken()
          .then((token: string) => {
            this.itemService.fetchItems(token)
              .subscribe((list: Item[]) => this.items = list);
          })
          .catch((error)=> console.error("error fetching elements", error));
      }else{
        this.navCtrl.push(LoginPage);
      }
    }
  }

  onDelete(item: Item) {
    const modal = this.modalCtrl.create(RemovePage, {
      item: item,
    });
    modal.present();
    modal.onDidDismiss((didRemove: boolean) => {
      if(didRemove){
        this.authService.getActiveUser().getToken()
          .then(
            (token: string) => {
              this.itemService.deleteItem(item, token).subscribe(
                () => {
                  //update local reference
                  this.items = this.itemService.getItems();
                  this.showToast("Elemento borrado");
                },
                error => {
                  // loading.dismiss();
                  this.handleError(error.json().error);
                }
              );
            }
          )
          .catch();
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
