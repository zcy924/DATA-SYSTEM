import { ReportPageInner } from '@core/node/page/report/page.inner';
import { AbstractPageView } from '@core/node/page/report/abstract.page.view';

export class RuntimePageView extends AbstractPageView {

  constructor(private _page: ReportPageInner) {
    super();
  }

  protected _init(){

  }

  set contextMenuGenerator(generator: Function) {
  }

  destroy() {

  }
}
