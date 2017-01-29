import { Component } from '@angular/core';
import {CalculationService} from "../../services/calculation-service";
import {CalculationResults} from "../../models/calculation-results";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html'
})
export class FilterPage {

  calculationResult: CalculationResults;
  startDate: string;
  endDate: string;

  constructor(private calculationService: CalculationService) {}

  ionViewWillEnter(){
    const date = new Date();
    //set the defaults to first day of the current month and last date of the current month
    this.endDate = this.formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    this.startDate = this.formatDate(new Date(date.getFullYear(), date.getMonth(), 1));
  }

  onFilter(form: NgForm) {
    this.startDate = form.value.startDate;
    this.endDate = form.value.endDate;
    this.calculationResult = this.calculationService.getResultsForDates(this.startDate, this.endDate);
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

}
