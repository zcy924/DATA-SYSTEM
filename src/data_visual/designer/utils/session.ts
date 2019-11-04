import { Subject } from 'rxjs';
import { ReportPage } from '../core/structure/page/report/page.outer';
import { SideLeftComponent } from '../layout/side/side.left.component';

class Session {
  private _currentPage: ReportPage;
  sideLeftComponent: SideLeftComponent;
  page = new Subject();

  set currentPage(value: ReportPage) {
    this._currentPage = value;
    this.page.next(value.reportPage);
  }

  get currentPage() {
    return this._currentPage;
  }

  get currentPage$() {
    return this.page.asObservable();
  }
}

export const session = new Session();
