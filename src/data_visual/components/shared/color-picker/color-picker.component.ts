import {
  OnInit, OnDestroy, AfterViewInit,
  ElementRef, forwardRef, Component,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomControlValueAccessor } from '../../config/CustomControlValueAccessor';


export const COLOR_PICKER_CONFIG_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ColorPickerComponent),
  multi: true,
};


@Component({
  selector: '[colorPicker]',
  template: '<ng-content></ng-content>',
  providers: [COLOR_PICKER_CONFIG_VALUE_ACCESSOR],
})
export class ColorPickerComponent extends CustomControlValueAccessor implements OnInit, OnDestroy, AfterViewInit {
  option: string;

  constructor(private _elementRef: ElementRef) {
    super();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    $(this._elementRef.nativeElement).colpick({
      layout: 'rgbhex',
      color: this.option ? this.option.slice(1) : '112233',
      livePreview: 0,
      onSubmit: (hsb, hex, rgb, el) => {
        // $(el).css('background-color', '#'+hex);
        this.option = hex;
        console.log(hex);
        this._propagateChange('#'+hex);
        $(el).colpickHide();
      },
    });
  }

  ngOnDestroy(): void {
  }
}
