import { AfterViewInit, Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { session } from '../utils/session';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { CommService } from '../service/comm.service';
import { designerStorage } from '../utils/designer.storage';
import { FilterTools, HelperTools, MoreTools } from './overlay.template';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { componentManager, Destroyable, Dimensions } from '@data-studio/shared';
import { imageDimensions$ } from '../utils/common';
import { grabHelper } from '../utils/grab.helper';
import { PopupHelper } from '../utils/popup.helper';

@Component({
  selector: 'app-designer-header',
  templateUrl: './designer.header.component.html',
  styleUrls: ['./designer.header.component.less'],
})
export class DesignerHeaderComponent extends Destroyable implements AfterViewInit, OnDestroy {

  helperToolsPopup: PopupHelper;
  filterToolsPopup: PopupHelper;
  moreToolsPopup: PopupHelper;
  @Output() switch = new EventEmitter();

  reportTile: string;
  spaceId;

  constructor(private _service: CommService, private _router: ActivatedRoute, private nzMessage: NzMessageService) {
    super();
  }

  ngOnInit() {
    const url = this._router.snapshot.routeConfig.path;
    const subscription = designerStorage.reportInfo$.subscribe((reportInfo: any) => {

      if (url == 'report-designer') {
        console.log('reportInfo.Report.attr', reportInfo.Report.attr);
        this.reportTile = reportInfo.Report.reportName;
        reportInfo.Report ? this.doLoad(reportInfo.Report.attr) : null;
      } else {
        console.log('reportInfo.attr', reportInfo.attr);
        this.reportTile = reportInfo.name;
        reportInfo.attr ? this.doLoad(reportInfo.attr) : null;
      }
    });
    this.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  ngOnDestroy() {
    this.destroy();
  }

  mouseEnter(event: MouseEvent, popupWrapper: PopupHelper, offsetLeft: number) {
    popupWrapper.show($(event.currentTarget).offset().left - offsetLeft);
  }

  preview() {
    session.currentPage.enterFullScreen();
  }

  exit() {
    history.go(-1);
  }

  get actionManager() {
    return session.currentPage ? session.currentPage.actionManager : null;
  }

  /**
   * 保存当前数据报告or大屏文件到服务端
   */
  doSave() {
    const url = this._router.snapshot.routeConfig.path;
    this._router.queryParams.subscribe(data => {
      this.spaceId = data.spaceId;
    });
    const params = Object.assign({},
      designerStorage.reportInfo.Report,
      {
        attr: JSON.stringify(session.currentPage.save(), null, 2),
        spaceId: this.spaceId,
      });
    if (url == 'report-designer') {
      this._service.modReport({ Report: params }).subscribe((data) => {
        this.nzMessage.success('保存成功!');
      });
    } else {
      this._service
        .saveScreenContent(Object.assign({},
          designerStorage.reportInfo,
          {
            attr: JSON.stringify(session.currentPage.save(), null, 2),
            spaceId: this.spaceId,
          })).subscribe((data) => {
        this.nzMessage.success('保存成功!');
      });
    }
  }

  /**
   * 通过浏览器下载当前编辑器打开的数据报告or大屏文件
   */
  doDownload() {
    const blob = new Blob([JSON.stringify(session.currentPage.save(), null, 2)], { type: 'text/plain;charset=utf-8' });

    FileSaver.saveAs(blob, `zijin.template.${moment().format('YYYYMMDDHHmmss')}.json`);
  }

  /**
   * 打开数据报告or大屏文件
   * @param report
   */
  doLoad(report: any) {
    session.currentPage.load(report);
  }

  templateChange(event: Event) {
    const that = this;
    const file: HTMLInputElement = <HTMLInputElement>event.currentTarget;
    if (!file.files || !file.files[0]) {
      return;
    }
    // this.option.fileName = file.files[0].name;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = (<any>evt.target).result;
      session.currentPage.load(JSON.parse(text));
      (<HTMLFormElement>file.parentElement).reset();
    };
    reader.readAsText(file.files[0]);
  }

  addImage(event: Event) {
    const option: any = {
        preserveAspectRatio: false,
        backgroundColor: undefined,
        borderStyle: 'solid',
        borderColor: '#ccc',
        borderWidth: 0,
        borderRadius: 0,
        image: {
          width: 400,
          height: 300,
          url: '',
          dataUrl: '',
        },
      },
      file = <HTMLInputElement>event.currentTarget;

    if (!file.files || !file.files[0]) {
      return;
    }
    option.image.fileName = file.files[0].name;
    const reader = new FileReader();
    reader.onload = (evt) => {
      option.image.dataUrl = (<any>evt.target).result;
      imageDimensions$((<any>evt.target).result)
        .subscribe((dimensions: Dimensions) => {
          Object.assign(option.image, dimensions);
        }, () => {
        }, () => {
          if (session.currentPage) {
            session.currentPage.createGraphic('standard$image.graphic', 200, 200, option);
          }
        });
      (<HTMLFormElement>file.parentElement).reset();

    };
    reader.readAsDataURL(file.files[0]);
  }

  dragStart(dragEvent: DragEvent) {
    let componentPath: string;
    const mouseMove = (event: MouseEvent) => {
      console.log('mouseMove');
      grabHelper.refresh(event.pageX, event.pageY);
    };
    const mouseUp = (event: MouseEvent) => {
      console.log('document mouseup', event, session.currentPage.offset());

      session.currentPage.createGraphic(componentPath,
        event.pageX - session.currentPage.offset().left - grabHelper.offsetX,
        event.pageY - session.currentPage.offset().top - grabHelper.offsetY);
      grabHelper.hidden();
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    };

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
    componentPath = (<HTMLElement>event.target).dataset.componentPath;
    grabHelper.show(dragEvent.pageX, dragEvent.pageY,
      componentManager.getComponentMeta(componentPath).grabOption);
    return false;
  }

  doSwitch(event) {
    this.switch.emit();
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit header');
    this.helperToolsPopup = helperToolsPopup;
    this.filterToolsPopup = filterToolsPopup;
    this.moreToolsPopup = moreToolsPopup;
  }

}

const helperToolsPopup = new PopupHelper(HelperTools);
const filterToolsPopup = new PopupHelper(FilterTools);
const moreToolsPopup = new PopupHelper(MoreTools);

document.addEventListener('click', (event) => {
  helperToolsPopup.hide();
  filterToolsPopup.hide();
  moreToolsPopup.hide();
});


