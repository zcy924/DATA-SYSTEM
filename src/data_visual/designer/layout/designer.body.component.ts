import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { session } from '../utils/session';
import * as _ from 'lodash';
import { ReportPage } from '../core/structure/page/report/page.outer';
import { reportPageBuilder } from '../startup/page.builder';

@Component({
  selector: 'app-designer-body',
  templateUrl: './designer.body.component.html',
  styleUrls: ['./designer.body.component.less'],
})
export class DesignerBodyComponent implements AfterViewInit, OnDestroy {

  private _$element: JQuery;
  report: ReportPage;

  leftPanelState = false;

  constructor(private _elementRef: ElementRef) {
    this._$element = $(this._elementRef.nativeElement);
  }

  openRightPanel() {
    const ele = this._$element.find('.app-body-right')[0];
    ele.style.width = '420px';
    ele.style.flexBasis = '420px';
  }

  closeRightPanel() {
    const ele = this._$element.find('.app-body-right')[0];
    ele.style.width = '220px';
    ele.style.flexBasis = '220px';
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   const report = this.report = session.currentPage = new ReportPageOuter('design');
    //   $('.app-content').prepend(report.$element);
    // }, 100);

    const report = this.report = session.currentPage = reportPageBuilder.build('design');
    $('.app-content').prepend(report.$element);

    // const dashboardCanvas = new DashboardCanvas();
    // $('.app-content').prepend(dashboardCanvas.$element);


    return;
  }

  ngOnDestroy() {
    if (this.report) {
      this.report.destroy();
      this.report = null;
    }
  }

  formatter(value) {
    return `${value}%`;
  }

  scaleChange(event) {
    this.report.reportPage.scale = event;
  }

}
