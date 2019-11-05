import {
  Component, forwardRef,
} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

import {CustomControlValueAccessor} from '../config/CustomControlValueAccessor';
import { imageDimensions$ } from '../../designer/utils/common';

export const IMAGE_SELECT_CONFIG_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ImageSelectConfigComponent),
  multi: true
};

@Component({
  selector: 'app-image-select',
  templateUrl: './image.select.config.component.html',
  styleUrls: ['./image.select.config.component.less'],
  providers: [IMAGE_SELECT_CONFIG_VALUE_ACCESSOR]
})
export class ImageSelectConfigComponent extends CustomControlValueAccessor {

  option = {
    alt: '我是标题',
    fileName: null,
    url: null,
    dataUrl: null,
    width: 0,
    height: 0
  };


  constructor() {
    super();
  }

  change(event: Event) {
    const that = this;
    const file: HTMLInputElement = <HTMLInputElement>event.currentTarget;
    if (!file.files || !file.files[0]) {
      return;
    }
    this.option.fileName = file.files[0].name;
    const reader = new FileReader();
    reader.onload = (evt) => {
      this.option.dataUrl = (<any>evt.target).result;
      imageDimensions$((<any>evt.target).result).subscribe((dimensions)=>{
        Object.assign(that.option,dimensions);
        that._propagateChange(Object.assign({}, that.option));
      });
    };
    reader.readAsDataURL(file.files[0]);
  }
}
