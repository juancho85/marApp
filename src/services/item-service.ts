import {Item} from "../models/item";
import {AuthService} from "./auth-service";
import {Http, Response} from "@angular/http";
import 'rxjs/Rx';
import {Injectable} from "@angular/core";

@Injectable()
export class ItemService {

  private baseUrl: string = 'https://marapp-e0bd1.firebaseio.com';

  items: Item[] = [];

  constructor(private http: Http,
              private authService: AuthService) {}

  addItem(item: Item) {
    this.items.push(item);
  }

  getItems() {
    return this.items.slice();
  }

  deleteItem(index: number) {
    this.items.splice(index, 1);
  }

  fetchItems(token: string) {
    const userId = this.authService.getActiveUser().uid;
    const url = `${this.baseUrl}/${userId}/items.json?auth=${token}`;
    return this.http.get(url)
      .map((response: Response) => {
        return response.json();
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
