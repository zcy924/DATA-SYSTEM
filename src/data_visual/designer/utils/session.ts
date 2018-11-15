import { Subject } from 'rxjs';
import { ReportPageOuter } from '../core/page/report/page.outer';
import { SiderLeftComponent } from '../layout/sider/sider.left.component';

class Session {
  private _currentPage: ReportPageOuter;
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
