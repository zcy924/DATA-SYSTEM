import {ModelEventTarget} from '../../../designer/core/event/model.event';
import * as _ from 'lodash';

export class PageConfig extends ModelEventTarget {
  option: any;

  exportOption() {
    return _.cloneDeep(this.option);
  }

  importOption(option) {
    this.option = option;
  }
}
