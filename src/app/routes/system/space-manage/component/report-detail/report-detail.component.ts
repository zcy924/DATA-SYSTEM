import { AfterViewInit, Component, ElementRef, KeyValueDiffers, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpaceManageService } from '../../space-manage.service';
import { switchMap } from 'rxjs/operators';
import { HttpResponse } from "@angular/common/http";
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportKeepModalComponent } from './modal/report-keep-modal.component';
import { PersonalCenterService } from '../../../personal-center/personal-center.service';
import { ReportPageOuter } from '../../../../../../data_visual/designer/core/page/report/page.outer';
import { session } from '../../../../../../data_visual/designer/utils/session';
import { Runtime } from '../../../../../../data_visual/runtime';
import { StandardCompRepo } from '../../../../../../data_visual/component.packages/standard';
import { CustomCompRepo } from '../../../../../../data_visual/component.packages/custom';
import { standardGeneratorRepo } from '../../../../../../data_visual/data.source.packages/mock';


@Component({
  templateUrl: './report-detail.html',
  styleUrls: ['./report-detail.less'],
})
export class ReportDetailComponent implements AfterViewInit, OnInit, OnDestroy {

  heartIconTheme: boolean = false;
  reportResponse;
  keepReportId;

  report: ReportPageOuter;
  runTime;
  reportName;
  spaceId: string;

  leftPanelState = false;

  constructor(private _elementRef: ElementRef,
    private _differs: KeyValueDiffers,
    private _router: ActivatedRoute,
    private _spaceManageService: SpaceManageService,
    private _personalService: PersonalCenterService,
    private _nzModel: NzModalService,
    private _nzMessage: NzMessageService) {
  }

  ngOnInit() {
    this.spaceId = this._router.snapshot.parent.params.spaceId;
  }

  getReportContent() {
    const reportInfo$ = this._router.params.pipe(switchMap(data => {
      return this._spaceManageService.qryReportContent({
        Report: {
          reportId: data.reportId,
          spaceId: this.spaceId,
        },
      });
    }));
    reportInfo$.subscribe(data => {

      this.reportResponse = data['Report'];
      this.heartIconTheme = this.reportResponse.keepFlag === 'T';
      this.keepReportId = data.keepReportId;

      this.report.clear();
      this.reportName = data.Report.reportName;
      if (data.Report.attr !== null && data.Report.attr !== '' && JSON.stringify(data.Report.attr) !== "{}" && data.Report.attr !== undefined) {
        if (this.runTime !== undefined) {
          this.report = this.runTime.open(data.Report.attr);
        } else {
          this.runTime = Runtime.getInstance();
          this.runTime.addComponentRepository(StandardCompRepo);
          this.runTime.addComponentRepository(CustomCompRepo);
          this.runTime.addGeneratorRepository(standardGeneratorRepo);
          this.report = this.runTime.open(data.Report.attr);
        }
        $('.app-content').empty();
        $('.app-content').prepend(this.report.$element);
      } else {
        this._nzMessage.warning('该报表尚未编辑!');
      }
    }, err => {
      if (err instanceof HttpResponse) {
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
    // this.report.destroy();
  }

  formatter(value) {
    return `${value}%`;
  }

  scaleChange(event) {
    this.report.reportPage.scale = event;
  }

  // 收藏报表对话框
  keepSelf() {
    if (this.heartIconTheme) {
      // 批量删除报表收藏
      this._nzModel.confirm({
        nzTitle: '是否取消收藏?',
        nzOnOk: res => {
          let params = {
            keepReportId: this.keepReportId,
          };
          this._personalService.delSelfReport(params).subscribe(
            res => {
              this._nzMessage.success('取消收藏成功！');
              this.heartIconTheme = false;
            },
            err => {
              if (err instanceof HttpResponse) {
                this._nzMessage.error('取消收藏失败！');
              }
            },
          );
        },
      });
    } else {
      const modal = this._nzModel.create({
        nzTitle: `收藏报表`,
        nzContent: ReportKeepModalComponent,
        nzWidth: '50%',
        nzComponentParams: {
          remark: this.reportResponse.remark,
          reportName: this.reportResponse.reportName,
          reportId: this.reportResponse.reportId,
        },
        nzFooter: [
          {
            label: '新建文件夹',
            type: 'primary',
            onClick: res => {
              res.addFolderInSpace();
            },
          },
          {
            label: '关闭',
            shape: 'default',
            onClick: () => modal.destroy(),
          },
          {
            label: '收藏',
            type: 'primary',
            onClick: res => {
              return new Promise(reslove => {
                res.keepSelfReportInSpace();
              });
            },
          },
        ],
      });
      modal.afterClose.subscribe(data => {
        if (data == 'ok') {
          this.heartIconTheme = true;
        }
      });
    }
  }
}
