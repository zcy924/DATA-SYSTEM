import { AfterViewInit, Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { session } from '../utils/session';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { CommService } from '../service/comm.service';
import { designerStorage } from '../../utils/designer.storage';
import { Destroyable } from '../../shared/interface/destroyable';
import { FilterTools, HelperTools, MoreTools } from './overlay.template';
import { Dimensions } from '../core/interface';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ComponentRepositoryManager } from '../../shared/manager/component.repository.manager';
import { graphicFactory } from '../core/graphic/graphic.factory';
import { imageDimensions$ } from '../utils/common';

@Component({
  selector: 'app-designer-header',
  templateUrl: './designer.header.component.html',
  styleUrls: ['./designer.header.component.less'],
})
export class DesignerHeaderComponent extends Destroyable implements AfterViewInit, OnDestroy {

  helperToolsPopup: PopupWrapper;
  filterToolsPopup: PopupWrapper;
  moreToolsPopup: PopupWrapper;
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
        this.reportTile = reportInfo.Report.reportName;
        reportInfo.Report ? this.doLoad(reportInfo.Report.attr) : null;
      } else {
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

  mouseEnter(event: MouseEvent, popupWrapper: PopupWrapper, offsetLeft: number) {
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

  doSave() {
    // const blob = new Blob([JSON.stringify(session.currentPage.save(), null, 2)], { type: 'text/plain;charset=utf-8' });
    //
    // FileSaver.saveAs(blob, `zijin.template.${moment().format('YYYYMMDDHHmmss')}.json`);
    const url = this._router.snapshot.routeConfig.path;
    this._router.queryParams.subscribe(data=>{
      this.spaceId = data.spaceId;
    })
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

  doDownload() {
    const blob = new Blob([JSON.stringify(session.currentPage.save(), null, 2)], { type: 'text/plain;charset=utf-8' });

    FileSaver.saveAs(blob, `zijin.template.${moment().format('YYYYMMDDHHmmss')}.json`);
  }

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
            graphicFactory.newGraphicByName(session.currentPage, 'standard$image.graphic', 200, 200, option);
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

      graphicFactory.createByName(componentPath, session.currentPage,
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
      ComponentRepositoryManager.getInstance().getComponentMeta(componentPath).grabOption);
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

class PopupWrapper {
  private readonly _$element: JQuery;

  constructor(template: string) {
    this._$element = $(template);
    $('body').append(this._$element);

    this._init();
  }

  private _init() {
    let componentPath: string;
    this._$element.mouseleave(() => {
      this._$element.hide();
    });
    this._$element.find('.btn-item.draggable')
      .on('dragstart', ($event: JQuery.Event) => {
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
        componentPath = (<HTMLElement>$event.target).dataset.componentPath;

        grabHelper.show($event.pageX, $event.pageY, ComponentRepositoryManager.getInstance().getComponentMeta(componentPath).grabOption);
        return false;
      });

    const mouseMove = (event: MouseEvent) => {
      console.log('mouseMove');
      grabHelper.refresh(event.pageX, event.pageY);
    };
    const mouseUp = (event: MouseEvent) => {
      console.log('document mouseup', event, session.currentPage.offset());

      graphicFactory.createByName(componentPath, session.currentPage,
        event.pageX - session.currentPage.offset().left - grabHelper.offsetX,
        event.pageY - session.currentPage.offset().top - grabHelper.offsetY);
      grabHelper.hidden();
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    };
  }

  show(left: number) {
    this._$element.css({ left }).show();
  }

  hide() {
    this._$element.hide();
  }
}

const helperToolsPopup = new PopupWrapper(HelperTools);
const filterToolsPopup = new PopupWrapper(FilterTools);
const moreToolsPopup = new PopupWrapper(MoreTools);

document.addEventListener('click', (event) => {
  helperToolsPopup.hide();
  filterToolsPopup.hide();
  moreToolsPopup.hide();
});

const grabTemplate = `<div class="m-chart-grabing"
 style="width: 300px; height: 200px;
 background-color: rgb(36, 148, 232);
 background-image: url('https://ydcdn.nosdn.127.net/dash-online/img/holder-automatic.8f656e5b7d.svg');
 background-repeat: no-repeat; background-position: center center;
 background-size: 320px 224px; z-index: 1000; position: absolute;opacity: 0.5;cursor: grabbing;
 left: 122px; top: 206px;">
 <div class="g-grab-fill"></div><div class="g-grab-fill u-mover"></div>
 </div>
`;

class GrabHelper {
  private readonly _$element: JQuery;

  private _state = false;
  private _defaultOption = {
    width: 300,
    height: 200,
    backgroundImage: 'url("https://ydcdn.nosdn.127.net/dash-online/img/holder-automatic.8f656e5b7d.svg")',
    backgroundSize: '320px 224px',
  };
  private _option;

  constructor(template: string) {
    this._$element = $(template);
  }

  get offsetX() {
    return this._option.width / 2;
  }

  get offsetY() {
    return this._option.height / 2;
  }

  show(left: number, top: number, option?: { width: number, height: number, backgroundImage: string }) {
    this._option = option ? option : this._defaultOption;
    this._$element.css(this._option);
    this._$element.css({ backgroundSize: `${this._option.width}px ${this._option.height}px` });
    if (!this._state) {
      $('body').append(this._$element);
      this._state = true;
    }
    this._$element.css({
      left: left - this.offsetX,
      top: top - this.offsetY,
    });
  }

  refresh(left: number, top: number) {
    this._$element.css({
      left: left - this.offsetX,
      top: top - this.offsetY,
    });
  }

  hidden() {
    this._option = null;
    this._$element.detach();
    this._state = false;
  }
}

export const grabHelper = new GrabHelper(grabTemplate);


