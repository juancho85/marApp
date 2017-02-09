import { Component } from '@angular/core';
import {CalculationService} from "../../services/calculation-service";
import {CalculationResults} from "../../models/calculation-results";
import {NgForm} from "@angular/forms";
import {Item} from "../../models/item";
import {AlertController, ToastController, ModalController} from "ionic-angular";
import {AuthService} from "../../services/auth-service";
import {ItemService} from "../../services/item-service";
import {RemovePage} from "../remove/remove";
import {OrderItemsPipe} from "../../pipes/order-items.pipe";

@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html'
})
export class FilterPage {

  calculationResult: CalculationResults;
  startDate: string;
  endDate: string;
  filteredItems: Item [] = [];
  totalGrossIncome: number = 0;
  totalNetIncome: number = 0;
  totalWorkingHours: number = 0;

  constructor(private calculationService: CalculationService,
              private itemService: ItemService,
              private modalCtrl: ModalController,
              private toastCtrl: ToastController,
              private authService: AuthService,
              private alertCtrl: AlertController,
              private orderItemsPipe: OrderItemsPipe) {}

  ionViewWillEnter(){
    const date = new Date();
    //set the defaults to first day of the current month and last date of the current month
    this.startDate = this.formatDate(new Date(date.getFullYear(), date.getMonth(), 1));
    this.endDate = this.formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    console.log(this.startDate);
    console.log(this.endDate);
  }

  onFilter(form: NgForm) {
    this.startDate = form.value.startDate;
    this.endDate = form.value.endDate;
    this.calculateTotals();
    this.filteredItems = this.calculationResult.filteredItems;
    if(this.filteredItems){
      this.filteredItems = this.orderItemsPipe.transform(this.filteredItems);
    }
  }

  calculateTotals(){
    this.calculationResult = this.calculationService.getResultsForDates(this.startDate, this.endDate);
    this.totalGrossIncome = this.calculationResult.patientGrossAmount + this.calculationResult.receptionGrossAmount + this.calculationResult.marketingGrossAmount;
    this.totalNetIncome = this.calculationResult.patientGrossAmount * 0.93 + this.calculationResult.receptionGrossAmount + this.calculationResult.marketingGrossAmount;
    this.totalWorkingHours = this.calculationResult.patientTotalHours + this.calculationResult.receptionTotalHours + this.calculationResult.marketingTotalHours;
  }


  formatDate(date: Date) {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('/');
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
                  //update local references
                  this.filteredItems.splice(this.filteredItems.indexOf(item),1);
                  this.calculateTotals();
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
