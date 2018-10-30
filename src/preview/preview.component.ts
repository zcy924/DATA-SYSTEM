import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {ReportPageInner} from '@core/node/page/report/page.inner';
import {session} from '@core/node/utils/session';
import * as _ from 'lodash';

import {ReportPageOuter} from '@core/node/page/report/page.outer';

@Component({
  selector: 'app-designer-body',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.less']
})
export class PreviewComponent implements AfterViewInit {

  report: ReportPageOuter;

  leftPanelState = false;

  constructor(private _elementRef: ElementRef) {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      const report = this.report = session.currentPage = new ReportPageOuter('design');
      $('.app-content').prepend(report.$element);
    }, 100);
    return;
  }

  formatter(value) {
    return `${value}%`;
  }

  scaleChange(event) {
    this.report.reportPage.scale = event;
  }

}
