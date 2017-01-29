import {Item} from "../models/item";

export class ItemService {

  items: Item[] = [];

  addItem(item: Item) {
    this.items.push(item);
  }

  getItems() {
    console.log("getItems");
    console.log(this.items);
    return this.items.slice();
  }

  deleteItem(index: number) {
    this.items.splice(index, 1);
  }

  fetchItems() {
    //
  }

  persistItems() {
    //
  }

}
