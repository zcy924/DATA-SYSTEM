import { Injectable } from '@angular/core';
import { Menu } from 'app/models/menu';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SideMenuService {
  subject = new Subject();
  menu: Array<Menu>;
  constructor() {}
  setMenu(menu) {
    this.menu = menu;
  }
  getMenu() {
    return this.menu;
  }
  setMessage(msg: Array<Menu>) {
    this.subject.next(msg);
  }
  clearMessage() {
    this.subject.next();
  }
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
