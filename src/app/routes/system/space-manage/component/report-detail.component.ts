import {AfterViewInit, Component, ElementRef, KeyValueDiffers, OnInit} from '@angular/core';
import {session} from '@core/node/utils/session';
import {ReportPageOuter} from '@core/node/page/report/page.outer';
import {ActivatedRoute} from "@angular/router";
import {SpaceManageService} from "../space-manage.service";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-designer-body',
  templateUrl: './report-detail.html',
  styleUrls: ['./report-detail.less']
})
export class ReportDetailComponent implements AfterViewInit, OnInit {

  report: ReportPageOuter;
  reportId;

  leftPanelState = false;

  constructor(private _elementRef: ElementRef,
              private _differs: KeyValueDiffers,
              private _router: ActivatedRoute,
              private spaceManageService: SpaceManageService) {
    session.differs = _differs;
  }
  ngOnInit(){
    const report = this.report = session.currentPage = new ReportPageOuter('runtime');
    $('.app-content').prepend(report.$element);
    this.getReportContent();
  }

  getReportContent() {
    const reportInfo$ = this._router.params.pipe(switchMap(data => {
      return this.spaceManageService.qryReportContent({
        Report: {
          reportId: data.reportId,
          spaceId: localStorage.getItem('spaceID')
        }
      });
    }));
    reportInfo$.subscribe(data => {
      this.report.load(data.Report.attr);
    })
  }

  ngAfterViewInit() {
    // this.getReportContent();
    // setTimeout(() => {
    //   const report = this.report = session.currentPage = new ReportPageOuter('runtime');
    //   $('.app-content').prepend(report.$element);
    //   // this.report.load();
    //   this.getReportContent();
    // }, 100);
    // return;
  }

  formatter(value) {
    return `${value}%`;
  }

  scaleChange(event) {
    this.report.reportPage.scale = event;
  }

}
