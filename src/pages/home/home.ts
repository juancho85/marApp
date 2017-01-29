import {Component} from '@angular/core';

import {AddPage} from "../add/add";
import {ItemService} from "../../services/item-service";
import {Item} from "../../models/item";
import {FilterPage} from "../filter/filter";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  addPage = AddPage;
  filterPage = FilterPage

  items: Item[] = [];

  constructor(private itemService: ItemService) {}

  ionViewWillEnter(): void {
    console.log("ionViewWillEnter");
    this.items = this.itemService.getItems();
  }

}
