import {KeyValueDiffers} from '@angular/core';

import {GraphicConfig} from '../core/config/design/graphic.config';
import {Subject} from 'rxjs';
import { ReportPageOuter } from '../core/page/report/page.outer';
import { SiderLeftComponent } from '../layout/sider/sider.left.component';

class Session {
  differs: KeyValueDiffers;
  private _currentPage: ReportPageOuter;
  currentGraphicConfig: GraphicConfig;
  siderLeftComponent: SiderLeftComponent;
  pageChange = new Subject();

  set currentPage(value: ReportPageOuter) {
    this._currentPage = value;
    this.pageChange.next(value.reportPage);
  }

  get currentPage() {
    return this._currentPage;
  }
}

export const session = new Session();
