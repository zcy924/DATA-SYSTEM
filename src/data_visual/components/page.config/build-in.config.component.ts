import {
  Component, forwardRef, HostBinding,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { CustomControlValueAccessor } from '../config/CustomControlValueAccessor';

export const BUILD_IN_CONFIG_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BuildInConfigComponent),
  multi: true,
};

@Component({
  selector: 'app-build-in',
  templateUrl: './build-in.config.component.html',
  styleUrls: ['./build-in.config.component.less'],
  providers: [BUILD_IN_CONFIG_VALUE_ACCESSOR],
})
export class BuildInConfigComponent extends CustomControlValueAccessor {

  option = 'background1';

  @HostBinding('class.input-list-items') listItem = true;

  constructor() {
    super();
  }

  buildInClick(value) {
    if (value !== this.option) {
      this.option = value;
      this._propagateChange(value);
    }
  }

}
