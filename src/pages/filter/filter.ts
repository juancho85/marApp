import { Component } from '@angular/core';
import {CalculationService} from "../../services/calculation-service";
import {CalculationResults} from "../../models/calculation-results";

@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html'
})
export class FilterPage {

  calculationResult: CalculationResults;
  startDate = new Date().toISOString();
  endDate = new Date().toISOString();

  constructor(private calculationService: CalculationService) {}

  onFilter(startDate: any, endDate: any) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.calculationResult = this.calculationService.getResultsForDates(startDate, endDate);
  }

}
