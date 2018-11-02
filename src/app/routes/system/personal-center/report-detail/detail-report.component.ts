import { AfterViewInit, Component, ElementRef, KeyValueDiffers, OnDestroy, OnInit } from '@angular/core';
import { session } from '@core/node/utils/session';
import { ReportPageOuter } from '@core/node/page/report/page.outer';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { HttpResponse } from "@angular/common/http";
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { PersonalCenterService } from '../personal-center.service';


@Component({
  templateUrl: './detail-report.html',
  styleUrls: ['./detail-report.less'],
})
export class DetailReportComponent implements AfterViewInit, OnInit, OnDestroy {

  keepReportId;
  
  report: ReportPageOuter;
  reportName;
  
  leftPanelState = false;

  constructor(private _elementRef: ElementRef,
              private _differs: KeyValueDiffers,
              private _acRouter: ActivatedRoute,
              private _router: Router,
              private _personalService:PersonalCenterService,
              private _nzModel: NzModalService,
              private _nzMessage: NzMessageService) {
    session.differs = _differs;
  }

  ngOnInit() {
  }

  getReportContent() {
    const reportInfo$ = this._acRouter.params.pipe(switchMap(data => {
      this.keepReportId = data.keepReportId;
      return this._personalService.getSelfReportInfo({
        reportId: data.reportId,
        keepReportId: data.keepReportId
      });
    }));
    reportInfo$.subscribe(data => {
      this.reportName = data.reportName;
      this.report.clear();
      if(data.attr){
        this.report.load(data.attr);
      }else {
        this._nzMessage.warning('该报表尚未编辑!');
      }
    },err=>{
      if(err instanceof HttpResponse){
        this._nzMessage.error(err.body.retMsg);
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

  // 取消收藏报表对话框
  unKeepSelf() {
    this._nzModel.confirm({
      nzTitle: '是否取消收藏?',
      nzOnOk: res => {
        let params = {
          keepReportId: this.keepReportId,
        };
        this._personalService.delSelfReport(params).subscribe(
          res => {
            this._nzMessage.success('取消收藏成功！');
            this._router.navigateByUrl('app/user/user-report');
          },
          err => {
            if (err instanceof HttpResponse) {
              this._nzMessage.error('取消收藏失败！');
            }
          },
        );
      },
    });
  }
}
