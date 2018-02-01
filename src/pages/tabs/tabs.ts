import {Component} from '@angular/core';
import {HomePage} from "../home/home";
import {ReservePage} from "../reserve/reserve";
import {ProfilePage} from "../profile/profile";
import {ListPage} from "../list/list";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  homeRoot = HomePage;
  reserveRoot = ReservePage;
  profileRoot = ProfilePage;
  listRoot = ListPage;

  constructor() {

  }

}
