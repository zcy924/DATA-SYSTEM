import { Injectable } from '@angular/core';
import { Menu } from 'app/models/menu';

@Injectable()
export class SideMenuService {
  menu: { menu: Array<Menu> };
  constructor() {}
  setMenu(menu) {
    this.menu = menu;
  }
  getMenu() {
    return this.menu;
  }
}
