import {
  AfterViewInit,
  Component, EventEmitter, forwardRef, HostBinding, Input,
  KeyValueDiffer,
  KeyValueDiffers, NgZone,
  Output, TemplateRef,
  ViewChild,
} from '@angular/core';
import {NG_VALUE_ACCESSOR, NgForm} from '@angular/forms';

import {NzModalService} from 'ng-zorro-antd';
import {CustomControlValueAccessor} from '../CustomControlValueAccessor';
import {draggableHeler} from '../../../utils/draggable.helper';
import {contextMenuHelper} from '../../../utils/contextMenu';
import {NzModalFilterComponent} from '../../graphic.config/common/filter.modal.component';
import { Dimension } from '../../../designer/data/data.model.interface';
import { PieSeriesConfig } from '../../../component.packages/standard/chart/echart.interface/series/pie.series';

export const Pie_SERIES_CONFIG_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PieSeriesConfigComponent),
  multi: true
};

@Component({
  selector: 'app-pie-series-config',
  templateUrl: './pie.series.config.component.html',
  styleUrls: ['./pie.series.config.component.less'],
  providers: [Pie_SERIES_CONFIG_VALUE_ACCESSOR],
  host: {
    '[attr.seriesName]': 'option.name'
  }
})
export class PieSeriesConfigComponent extends CustomControlValueAccessor implements AfterViewInit {

  @ViewChild(NgForm) ngForm: NgForm;
  @ViewChild('modalTitle') tplTitle: TemplateRef<any>;

  @Input() option: PieSeriesConfig = {type: 'pie', name: 'hahaha'};
  @Input() seriesX: Array<Dimension> = [];
  @Input() seriesY: Array<Dimension> = [];

  @Output() seriesChange = new EventEmitter();

  // @HostBinding('attr.seriesName') role = 'button';
  private _differ: KeyValueDiffer<any, any>;
  private _filterArray: Array<any> = [];

  constructor(private _differs: KeyValueDiffers,
              private _modalService: NzModalService,
              private _zone: NgZone) {
    super();
  }

  dragenter(event: DragEvent) {
    event.dataTransfer.dropEffect = 'move';
    // 阻止浏览器默认事件
    event.preventDefault();
  }

  /**
   * 在其它的事件(如ondragover、ondragleave等），是无法获取dataTransfer里面的值了。
   * 这是由于W3C要求对dataTransfer里的值进行保护[参考]。
   * 因此，如果需要在这些事件里获取数据，只能通过一个全局变量等其它方式来实现了。
   * @param {DragEvent} event
   */
  dragover(event: DragEvent) {
    // 阻止浏览器默认事件
    event.preventDefault();
  }

  drop(event: DragEvent, target: Array<Dimension>) {
    // 火狐中取消drop默认行为，阻止打开URL
    event.preventDefault();

    target.push(draggableHeler.dragInfo);

    this._emit();
  }

  private _emit() {
    this._updateEncode();
    this.seriesChange.emit();
  }

  private _updateEncode() {
    this.option.data = [
      {value: 335, name: '直接访问'},
      {value: 310, name: '邮件营销'},
      {value: 274, name: '联盟广告'},
      {value: 235, name: '视频广告'},
      {value: 400, name: '搜索引擎'}
    ];
  }

  axisClick($event: MouseEvent, target: Array<Dimension>, index: number) {
    contextMenuHelper.open([
      {
        displayName: '修改显示名称',
        callback: () => {
          console.log('复制');
        }
      }, {
        displayName: '筛选器',
        icon: 'u-icn-filter',
        callback: () => {
          this.createComponentModal((<HTMLElement>$event.target).getAttribute('fieldName'));
          contextMenuHelper.close();
        }
      }, {
        displayName: '设置数轴',
        icon: 'u-icn-axis'
      }, {
        displayName: '编辑总计'
      }, {
        displayName: '取消总计'
      }, 'split', {
        displayName: '排序',
        icon: 'u-icn-sort-amount-asc'
      }, {
        displayName: '设置跳转',
        children: [
          {
            displayName: '设置跳转报告页'
          }, {
            displayName: '设置跳转报表'
          }, {
            displayName: '设置跳转链接'
          }
        ]
      }, 'split', {
        displayName: '移除',
        icon: 'u-icn-delete',
        callback: () => {
          this._zone.run(() => {
            console.log(123, target);
            target.splice(index, 1);
            contextMenuHelper.close();
          });
        }
      }
    ], $event.pageX, $event.pageY, $event, true);
  }

  createComponentModal(fieldName?: string): void {
    console.log('fieldName', fieldName);
    const modal = this._modalService.create({
      nzTitle: this.tplTitle,
      nzContent: NzModalFilterComponent,
      nzWidth: '870px',
      nzWrapClassName: 'filter-window',
      nzComponentParams: {
        title: 'title in component',
        subtitle: 'component sub title，will be changed after 2 sec',
        fieldName: fieldName
      },
      nzOnOk: (data) => {
        console.log(data);

        this._filterArray = [{
          name: 'listFilter',
          config: {
            fieldName: fieldName,
            list: data.goodList
          }
        }];

        // this._updateSeries();
      }
      // nzFooter: [{
      //   label: 'change component tilte from outside',
      //   onClick: (componentInstance) => {
      //     componentInstance.title = 'title in inner component is changed';
      //   }
      // }]
    });

    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));

    // Return a result when closed
    modal.afterClose.subscribe((result) => console.log('[afterClose] The result is:', result));

    // delay until modal instance created
    window.setTimeout(() => {
      const instance = modal.getContentComponent();
      instance.subtitle = 'sub title is changed';
    }, 2000);
  }

  ngAfterViewInit() {
    this.ngForm.valueChanges.subscribe((value) => {
      setTimeout(() => {
        this._propagateChange(this.option);
      }, 10);


    });
  }

}
