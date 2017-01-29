import {Item} from "../models/item";
import {ItemService} from "./item-service";
import {PhysedConfig} from "../config/physed-config";
import {Injectable} from "@angular/core";
import {CalculationResults} from "../models/calculation-results";

@Injectable()
export class CalculationService {

  filteredItems: Item[] = [];
  results: CalculationResults;

  constructor(private itemService: ItemService) {}

  getResultsForDates(startDate: any, endDate: any) {
    const originalItems = this.itemService.getItems();
    this.filteredItems =  this.applyFilterToData(originalItems, startDate, endDate);
    const patientActivities = this.filteredItems.filter(item => item.activity === 'Paciente');
    const receptionActivities = this.filteredItems.filter(item => item.activity === 'Recepcion');
    const marketingActivities = this.filteredItems.filter(item => item.activity === 'Marketing');

    const patientTotalHours = this.getNumberOfHours(patientActivities);
    const receptionTotalHours = this.getNumberOfHours(receptionActivities);
    const marketingTotalHours = this.getNumberOfHours(marketingActivities);

    const patientGrossAmount = this.getPatientGrossAmount(patientTotalHours);
    const receptionGrossAmount = this.getReceptionGrossAmount(receptionTotalHours);
    const marketingGrossAmount = this.getMarketingGrossAmount(marketingTotalHours);

    this.results = new CalculationResults(patientTotalHours, receptionTotalHours, marketingTotalHours, patientGrossAmount, receptionGrossAmount, marketingGrossAmount);
    return this.results;
  }

  private applyFilterToData(itemsToFilter: Item[], startDate: string, endDate: string): Item[]{
    return itemsToFilter.filter((item: Item) =>  item.eventDate >= startDate && item.eventDate <= endDate);
  }

  private getNumberOfHours(items: Item[]){
    if(items && items.length > 0){
      return items.map(function(item: Item) {
        return item.numberOfHours;
      }).reduce(function(a,b){
        return Number(a)+Number(b);
      });
    }
    return 0;
  }

  private getReceptionGrossAmount(receptionTotalHours: number){
    return receptionTotalHours * PhysedConfig.eurosRecepcion;
  }

  private getMarketingGrossAmount(marketingTotalHours: number){
    return marketingTotalHours * PhysedConfig.eurosMarketing;
  }

  private getPatientGrossAmount(patientTotalHours: number) {
    if (patientTotalHours <= PhysedConfig.ultimoIndiceTramo1) {
      return patientTotalHours * PhysedConfig.eurosSesionTramo1;
    } else if (patientTotalHours > PhysedConfig.ultimoIndiceTramo1 && patientTotalHours <= PhysedConfig.ultimoIndiceTramo2) {
      return (PhysedConfig.eurosSesionTramo1 * PhysedConfig.ultimoIndiceTramo1 +
      (patientTotalHours - PhysedConfig.ultimoIndiceTramo1) * PhysedConfig.eurosSesionTramo2)
    } else if (patientTotalHours > PhysedConfig.ultimoIndiceTramo2 && patientTotalHours <= PhysedConfig.ultimoIndiceTramo3) {
      return (PhysedConfig.eurosSesionTramo1 * PhysedConfig.ultimoIndiceTramo1 +
      PhysedConfig.eurosSesionTramo2 * (PhysedConfig.ultimoIndiceTramo2 - PhysedConfig.ultimoIndiceTramo1) +
      (patientTotalHours - PhysedConfig.ultimoIndiceTramo2) * PhysedConfig.eurosSesionTramo3)
    } else if (patientTotalHours >= PhysedConfig.ultimoIndiceTramo3) {
      return (PhysedConfig.eurosSesionTramo1 * PhysedConfig.ultimoIndiceTramo1 +
      PhysedConfig.eurosSesionTramo2 * (PhysedConfig.ultimoIndiceTramo2 - PhysedConfig.ultimoIndiceTramo1) +
      PhysedConfig.eurosSesionTramo3 * (PhysedConfig.ultimoIndiceTramo3 - PhysedConfig.ultimoIndiceTramo2) +
      (patientTotalHours - PhysedConfig.ultimoIndiceTramo3) * PhysedConfig.eurosSesionTramo4)
    } else {
      return 0;
    }
  }
}
