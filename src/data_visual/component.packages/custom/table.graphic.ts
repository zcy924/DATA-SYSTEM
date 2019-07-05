import { Observable, Subscription } from 'rxjs';
import { DefaultGraphic } from '@data-studio/shared';

const template = `
<div class="demo">
  <table class="bordered">
    <thead></thead>
    <tbody></tbody>
  </table>
</div>`;

export class TableGraphic extends DefaultGraphic {
  $element: JQuery;

  /**
   * 1、初始化视图
   * 2、给视图绑定事件处理函数
   * 3、建立父子关系
   * @param {Region} region
   */
  constructor(region: any) {
    super();
    this.$element = $(template);
  }

  init(option?: any) {
    this._modelEventTarget.register('option', (key, oldValue, newValue) => {
      this.update(newValue);
    });
  }

  private _generateHead(meta: Array<any>) {
    return `<tr>${meta.map((fieldDef) => {
      return `<th>${fieldDef.name}</th>`;
    }).join('')}</tr>`;
  }

  private _generateBody(meta: Array<any>, rows: Array<any>) {
    return rows.map((value, index, array) => {
      return `<tr>${meta.map((fieldDef) => {
        return `<td>${value[fieldDef.name]}</td>`;
      }).join('')}</tr>`;
    }).join('');
  }

  accept(modelSource: Observable<any>): Subscription {
    console.log('accept invoke', modelSource);

    let lastConfig, lastData;
    return modelSource.subscribe((modelArray: Array<any>) => {
      const [config, data] = modelArray;
      if (config !== lastConfig) {
        this._modelEventTarget.trigger(config);
        lastConfig = config;
      }
      if (data !== lastData) {
        if (data) {
          this.$element.find('thead').html(this._generateHead(data.dimensions));
          this.$element.find('tbody').html(this._generateBody(data.dimensions, data.source));
        }
        lastData = data;
      }
      console.log(config, data);
    });
  }


  update(option: any) {

  }
}
