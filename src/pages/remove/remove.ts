import { Component } from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';
import {ItemService} from "../../services/item-service";
import {Item} from "../../models/item";

@Component({
  selector: 'page-remove',
  templateUrl: 'remove.html'
})
export class RemovePage {

  index: number;
  item: Item;

  constructor(private navParams: NavParams,
              private viewCtrl: ViewController,
              private itemService: ItemService) {}

  ionViewWillLoad() {
    this.index = this.navParams.get('index');
    this.item = this.navParams.get('item');
  }

  onClose(remove = false){
    this.viewCtrl.dismiss(remove);
  }

}
