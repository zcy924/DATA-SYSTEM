import * as _ from 'lodash';
import {ModelEventTarget} from '../event/model.event';


export class PageConfig extends ModelEventTarget {
  option: any;

  exportOption() {
    return _.cloneDeep(this.option);
  }

  importOption(option) {
    this.option = option;
  }
}
