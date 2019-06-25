import * as _ from 'lodash';
import { ModelEventTarget } from '../../event';


export class BasePageConfig extends ModelEventTarget {
  option: any;

  exportOption() {
    return _.cloneDeep(this.option);
  }

  importOption(option) {
    this.option = option;
  }
}
