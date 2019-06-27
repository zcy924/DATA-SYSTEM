import { Subject } from 'rxjs';
import { ReportPage } from '../core/structure/page/report/page.outer';
import { SiderLeftComponent } from '../layout/sider/sider.left.component';

class Session {
  private _currentPage: ReportPage;
  siderLeftComponent: SiderLeftComponent;
  page = new Subject();

  set currentPage(value: ReportPage) {
    this._currentPage = value;
    this.page.next(value.reportPage);
  }

  get currentPage() {
    return this._currentPage;
  }

  get $currentPage() {
    return this.page.asObservable();
  }
}

export const session = new Session();
