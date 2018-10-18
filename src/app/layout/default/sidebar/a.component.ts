import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { SettingsService } from '@delon/theme';
import { SideMenuService } from '@shared/side-menu.service';
import { Menu } from 'app/models/menu';
import { Router } from '@angular/router';
@Component({
  selector: 'app-a',
  templateUrl: './a.component.html',
  styles: [
    `
      .folder-li {
        padding-left: 24px;
      }
      .group-li {
        padding: 24px 0 0 0;
      }
      .group-text {
        padding-left: 8px;
        color: rgba(0, 0, 0, 0.45);
      }
    `,
  ],
})
export class AComponent implements OnInit {
  @Input()
  items: {
    isRoot: Boolean;
    menu: Array<Menu>;
  };
  constructor(
    public settings: SettingsService,
    public msgSrv: NzMessageService,
    public sideMenu: SideMenuService,
    private router: Router,
  ) {}

  ngOnInit() {
    console.log(this.items);
  }
  go(url) {
    if (url !== undefined) {
      this.router.navigateByUrl(url);
    }
  }
}
