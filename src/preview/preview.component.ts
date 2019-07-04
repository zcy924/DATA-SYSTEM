import { AfterViewInit, Component } from '@angular/core';
import { ReportPage } from '../data_visual/designer/core/structure/page/report/page.outer';
import { session } from '../data_visual/designer/utils/session';
import { reportPageBuilder } from '../data_visual/designer/startup/page.builder';

@Component({
  selector: 'app-designer-body',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.less'],
})
export class PreviewComponent implements AfterViewInit {

  report: ReportPage;

  leftPanelState = false;

  constructor() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const report = this.report = session.currentPage = reportPageBuilder.build('design');
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
