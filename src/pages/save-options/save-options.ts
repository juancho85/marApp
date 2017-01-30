import { Component } from '@angular/core';
import {ViewController} from "ionic-angular";

@Component({
  selector: 'page-save-options',
  templateUrl: 'save-options.html'
})
export class SaveOptionsPage {

  constructor(private viewCtrl: ViewController){}

  onAction(action: string){
    this.viewCtrl.dismiss({
      action: action
    });
  }

}
