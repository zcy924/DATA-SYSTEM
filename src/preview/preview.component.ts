import { AfterViewInit, Component, ElementRef, KeyValueDiffers } from '@angular/core';
import { session } from '@core/node/utils/session';
import * as _ from 'lodash';
import { ReportPageOuter } from '../designer/designer/core/page/report/page.outer';

@Component({
  selector: 'app-designer-body',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.less'],
})
export class PreviewComponent implements AfterViewInit {

  report: ReportPageOuter;

  leftPanelState = false;

  constructor(private _elementRef: ElementRef, private _differs: KeyValueDiffers) {
    session.differs = _differs;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const report = this.report = session.currentPage = new ReportPageOuter('design');
      $('.app-content').prepend(report.$element);
      // this.report.load();
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
