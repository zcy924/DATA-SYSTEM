import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { SettingsService, MenuService } from '@delon/theme';
import { SideMenuService } from '@shared/side-menu.service';
@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  constructor(
    public settings: SettingsService,
    public msgSrv: NzMessageService,
    public sideMenu: SideMenuService,
    public menuServ: MenuService
  ) {
  }

  ngOnInit() {
    console.log(this.menuServ.menus)
  }
}
