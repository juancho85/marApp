import {Component} from '@angular/core';

import {AddPage} from "../add/add";
import {ItemService} from "../../services/item-service";
import {Item} from "../../models/item";
import {FilterPage} from "../filter/filter";
import {
  ModalController, ToastController, LoadingController,  AlertController } from "ionic-angular";
import {RemovePage} from "../remove/remove";
import {AuthService} from "../../services/auth-service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{

  addPage = AddPage;
  filterPage = FilterPage;

  items: Item[] = [];

  constructor(private itemService: ItemService,
              private modalCtrl: ModalController,
              private toastCtrl: ToastController,
              private loadCtrl: LoadingController,
              private authService: AuthService,
              private alertCtrl: AlertController) {}


  ionViewDidLoad(){
    const activeUser =  this.authService.getActiveUser();
    if(activeUser) {
      const load = this.loadCtrl.create({
        content: "Recuperando elementos - Por favor espera"
      });
      load.present();
      activeUser.getToken()
        .then((token: string) => {
          this.itemService.fetchItems(token)
            .subscribe((list: Item[]) => {
              this.items = list;
              load.dismiss();
            });
        })
        .catch((error)=> {
          console.error("error fetching elements", error);
          load.dismiss();
        });
    }
  }

  ionViewWillEnter(): void {
    const activeUser =  this.authService.getActiveUser();
    if(activeUser) {
      this.itemService.getItems();
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

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'Ha ocurrido un error',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }
}
