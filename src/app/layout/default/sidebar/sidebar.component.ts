import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { SideMenuService } from '@shared/side-menu.service';
import { Menu } from 'app/models/menu';
@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit, OnDestroy {
  menu: Menu;
  subscribtion;
  constructor(
    public settings: SettingsService,
    public sideMenu: SideMenuService,
  ) {}

  ngOnInit() {
    this.subscribtion = this.sideMenu.getMessage().subscribe(data => {
      console.log(data);
      this.menu = data;
      this.sideMenu.setMenu(data);
    });
  }
  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }
}
