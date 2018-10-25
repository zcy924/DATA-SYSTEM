import {
  Component,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  NavigationError,
  NavigationCancel,
} from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ScrollService, MenuService, SettingsService } from '@delon/theme';

import { environment } from '@env/environment';
import { SettingDrawerComponent } from './setting-drawer/setting-drawer.component';
import { last, first } from 'rxjs/operators';

@Component({
  selector: 'layout-default',
  templateUrl: './default.component.html',
  preserveWhitespaces: false,
  host: {
    '[class.alain-default]': 'true',
  },
})
export class LayoutDefaultComponent implements AfterViewInit, OnDestroy {
  isFetching = false;
  @ViewChild('settingHost', { read: ViewContainerRef })
  settingHost: ViewContainerRef;
  constructor(
    router: Router,
    scroll: ScrollService,
    _message: NzMessageService,
    private resolver: ComponentFactoryResolver,
    public menuSrv: MenuService,
    public settings: SettingsService,
  ) {
    // let flag = true;
    // scroll to top in change page
    const i =1;
    router.events.subscribe(evt => {
      // console.log(i++);
      // console.log(evt);
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        this.isFetching = true;
      }
      if (evt instanceof NavigationError || evt instanceof NavigationCancel) {
        this.isFetching = false;
        if (evt instanceof NavigationError) {
          // flag = false;
          // _message.error(`无法加载${evt.url}路由`, { nzDuration: 1000 * 3 });
        }
        return;
      }
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      setTimeout(() => {
        scroll.scrollToTop();
        this.isFetching = false;
      }, 100);
    });
  }

  ngAfterViewInit(): void {
    // Setting componet for only developer
    // if (!environment.production) {
    //   setTimeout(() => {
    //     const settingFactory = this.resolver.resolveComponentFactory(
    //       SettingDrawerComponent,
    //     );
    //     this.settingHost.createComponent(settingFactory);
    //   }, 22);
    // }
  }
  ngOnDestroy(){
    console.log("default.component被销毁了")
  }
}
