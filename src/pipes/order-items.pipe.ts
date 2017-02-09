import { Pipe, PipeTransform } from '@angular/core';
import {Item} from "../models/item";


@Pipe({
  name: 'orderItems'
})
export class OrderItemsPipe implements PipeTransform {

  transform(array: Array<Item>, args?: any): Array<Item> {
    array.sort((a: Item, b: Item) => {
      if (a.eventDate < b.eventDate) {
        return -1;
      } else if (a.eventDate > b.eventDate) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}
