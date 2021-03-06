import {
  AfterViewInit,
  Component, forwardRef, NgZone,
  ViewChild,
} from '@angular/core';
import {NG_VALUE_ACCESSOR, NgForm} from '@angular/forms';

import {CustomControlValueAccessor} from './CustomControlValueAccessor';
import {debounceTime} from 'rxjs/operators';
import {removeUndefined} from '../../designer/utils/common';
import { Grid } from '@data-studio/component/standard/lib/chart/echart.interface/grid';

export const GRID_CONFIG_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => GridConfigComponent),
  multi: true
};

@Component({
  selector: 'app-grid-config',
  templateUrl: './grid.config.component.html',
  styleUrls: ['./grid.config.component.less'],
  providers: [GRID_CONFIG_VALUE_ACCESSOR]
})
export class GridConfigComponent extends CustomControlValueAccessor implements AfterViewInit {


  @ViewChild(NgForm) ngForm: NgForm;

  option: Grid = {};

  constructor(private zone: NgZone) {
    super();
  }

  ngAfterViewInit() {
    this.ngForm.valueChanges.pipe(debounceTime(200)).subscribe((value) => {
      console.log('GridConfigComponent valueChanges', value);
      this._propagateChange(removeUndefined(value));
    });
  }

}
