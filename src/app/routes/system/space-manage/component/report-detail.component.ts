import { AfterViewInit, Component, ElementRef, KeyValueDiffers, OnDestroy, OnInit } from '@angular/core';
import { session } from '@core/node/utils/session';
import { ReportPageOuter } from '@core/node/page/report/page.outer';
import { ActivatedRoute } from '@angular/router';
import { SpaceManageService } from '../space-manage.service';
import { switchMap } from 'rxjs/operators';
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-designer-body',
  templateUrl: './report-detail.html',
  styleUrls: ['./report-detail.less'],
})
export class ReportDetailComponent implements AfterViewInit, OnInit, OnDestroy {

  report: ReportPageOuter;
  reportId;

  leftPanelState = false;

  constructor(private _elementRef: ElementRef,
              private _differs: KeyValueDiffers,
              private _router: ActivatedRoute,
              private spaceManageService: SpaceManageService) {
    session.differs = _differs;
  }

  ngOnInit() {

  }

  getReportContent() {
    const reportInfo$ = this._router.params.pipe(switchMap(data => {
      return this.spaceManageService.qryReportContent({
        Report: {
          reportId: data.reportId,
          spaceId: localStorage.getItem('spaceID'),
        },
      });
    }));
    reportInfo$.subscribe(data => {
      this.report.clear();
      if(data.Report.attr){
        this.report.load(data.Report.attr);
      }
    },err=>{
      if(err instanceof HttpResponse){
        console.log('error');
      }
    });
  }

  ngAfterViewInit() {
    const report = this.report = session.currentPage = new ReportPageOuter('runtime');
    $('.app-content').prepend(report.$element);
    this.getReportContent();
  }

  ngOnDestroy() {
    this.report.destroy();
  }

  formatter(value) {
    return `${value}%`;
  }

  scaleChange(event) {
    this.report.reportPage.scale = event;
  }

}
