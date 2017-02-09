import {Item} from "../models/item";
import {AuthService} from "./auth-service";
import {Http, Response} from "@angular/http";
import 'rxjs/Rx';
import {Injectable} from "@angular/core";
import {OrderItemsPipe} from "../pipes/order-items.pipe";

@Injectable()
export class ItemService {

  private baseUrl: string = 'https://marapp-e0bd1.firebaseio.com';

  items: Item[] = [];

  constructor(private http: Http,
              private authService: AuthService,
              private orderItemsPipe: OrderItemsPipe) {}

  addItem(item: Item, token: string) {
    const userId = this.authService.getActiveUser().uid;
    const url = `${this.baseUrl}/${userId}/items.json?auth=${token}`;
    return this.http.post(url, {
      activity: item.activity,
      eventDate: item.eventDate,
      numberOfHours: item.numberOfHours
    })
      .map((response: Response) => {
        const data = response.json();
        item.key = data.name;
        this.items.push(item);
        this.items = this.orderItemsPipe.transform(this.items);
        return item;
      })
      .catch((error) => {
        console.error("problem adding the element", error);
        return null;
      });
  }

  getItems() {
    this.items = this.orderItemsPipe.transform(this.items);
    return this.items.slice();
  }

  deleteItem(item: Item, token: string) {
    const userId = this.authService.getActiveUser().uid;
    const url = `${this.baseUrl}/${userId}/items/${item.key}.json?auth=${token}`;
    return this.http.delete(url)
      .map((response: Response) => {
        const index = this.items.indexOf(item);
        this.items.splice(index, 1);
      })
      .catch((error) => {
        console.log("problem deleting element");
        console.error(error);
        return error;
      });
  }

  fetchItems(token: string) {
    this.items = [];
    const userId = this.authService.getActiveUser().uid;
    const url = `${this.baseUrl}/${userId}/items.json?auth=${token}`;
    return this.http.get(url)
      .map((response: Response) => {
        const data = response.json();
        for (let key in data) {
          let it: Item = data[key];
          if(it){
            this.items.push(new Item(it.activity, it.eventDate, it.numberOfHours, key));
          }
        }
        this.items = this.orderItemsPipe.transform(this.items);
        return this.items;
      })
      .do((ingredients: Item[]) => {
        if(ingredients){
          this.items = ingredients;
        } else {
          this.items = [];
        }
      });
  }

  persistItems(token: string) {
    const userId = this.authService.getActiveUser().uid;
    const url = `${this.baseUrl}/${userId}/items.json?auth=${token}`;
    return this.http.put(url,this.items)
      .map((response: Response) => {
        return response.json();
      });
  }

}
