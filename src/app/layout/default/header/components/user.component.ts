import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'header-user',
  template: `
  <nz-dropdown nzPlacement="bottomRight">
    <div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown>
      <nz-avatar nzSrc="./assets/tmp/img/avatar.jpg" nzSize="small" class="mr-sm"></nz-avatar>
      {{settings.user.name}}
    </div>
    <div nz-menu class="width-sm">
      <div nz-menu-item routerLink="/app/user"><i nz-icon type="user"></i>个人中心</div>
      <div *ngIf="settings['user']['isCompanyAdmin']" nz-menu-item routerLink="/app/company">
        <i nz-icon type="home"></i>公司管理</div>
      <div *ngIf="settings['user']['isPlatformAdmin']" nz-menu-item routerLink="/app/platform">
        <i nz-icon type="home"></i>平台管理</div>
      <li nz-menu-divider></li>
      <div nz-menu-item (click)="logout()"><i class="anticon anticon-setting mr-sm"></i>退出登录</div>
    </div>
  </nz-dropdown>
  `,
})
export class HeaderUserComponent {
  constructor(
    public settings: SettingsService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {}

  logout() {
    // <div nz-menu-item routerLink="/app/system"><i class="anticon anticon-user mr-sm"></i>平台管理</div>
    this.tokenService.clear();
    localStorage.clear();
    this.settings.setUser({});
    this.settings.setApp({});
    this.router.navigateByUrl(this.tokenService.login_url);
  }
}
