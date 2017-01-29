import { Component } from '@angular/core';
import {CalculationService} from "../../services/calculation-service";
import {CalculationResults} from "../../models/calculation-results";

@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html'
})
export class FilterPage {

  calculationResult: CalculationResults;
  startDate: string;
  endDate: string;

  constructor(private calculationService: CalculationService) {
    const date = new Date();
    //set the defaults to first day of the current month and last date of the current month
    this.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
    this.startDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
  }

  onFilter(startDate: any, endDate: any) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.calculationResult = this.calculationService.getResultsForDates(startDate, endDate);
  }

}
