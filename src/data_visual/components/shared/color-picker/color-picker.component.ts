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
    const that = this;
    $(this._elementRef.nativeElement).colorPicker({
      customBG: '#222',
      margin: '4px -2px 0',
      doRender: 'div div',

      buildCallback: function($elm) {
        const colorInstance = this.color,
          colorPicker = this;

        $elm.prepend('<div class="cp-panel">' +
          'R <input type="text" class="cp-r" /><br>' +
          'G <input type="text" class="cp-g" /><br>' +
          'B <input type="text" class="cp-b" /><hr>' +
          'H <input type="text" class="cp-h" /><br>' +
          'S <input type="text" class="cp-s" /><br>' +
          'B <input type="text" class="cp-v" /><hr>' +
          '<input type="text" class="cp-HEX" />' +
          '</div>').on('change', 'input', function(e) {
          let value = this.value,
            className = this.className,
            type = className.split('-')[1],
            color = {};

          color[type] = value;
          colorInstance.setColor(type === 'HEX' ? value : color,
            type === 'HEX' ? 'HEX' : /(?:r|g|b)/.test(type) ? 'rgb' : 'hsv');
          colorPicker.render();
          this.blur();
        });
      },

      cssAddon: // could also be in a css file instead
        '.cp-color-picker{box-sizing:border-box; width:226px;z-index:999;}' +
        '.cp-color-picker .cp-panel {line-height: 21px; float:right;' +
        'padding:0 1px 0 8px; margin-top:-1px; overflow:visible}' +
        '.cp-xy-slider:active {cursor:none;}' +
        '.cp-panel, .cp-panel input {color:#bbb; font-family:monospace,' +
        '"Courier New",Courier,mono; font-size:12px; font-weight:bold;}' +
        '.cp-panel input {width:28px; height:12px; padding:2px 3px 1px;' +
        'text-align:right; line-height:12px; background:transparent;' +
        'border:1px solid; border-color:#222 #666 #666 #222;}' +
        '.cp-panel hr {margin:0 -2px 2px; height:1px; border:0;' +
        'background:#666; border-top:1px solid #222;}' +
        '.cp-panel .cp-HEX {width:44px; position:absolute; margin:1px -3px 0 -2px;}' +
        '.cp-alpha {width:155px;}',

      renderCallback: function($elm, toggled) {
        const colorInstance = this.color, colorPicker = this, RND = this.color.colors.RND,
          modes = {
            r: RND.rgb.r, g: RND.rgb.g, b: RND.rgb.b,
            h: RND.hsv.h, s: RND.hsv.s, v: RND.hsv.v,
            HEX: this.color.colors.HEX,
          };
        $('input', this.$UI.find('.cp-panel')).each(function() {
          (this as HTMLInputElement).value = modes[this.className.substr(3)];
        });
        if (toggled === true) { // simple, lightweight check
          // ... like an open callback
          colorInstance.setColor(that.option,
            /(?:r|g|b)/.test(that.option) ? 'rgb' : 'HEX');
          colorPicker.render();
          console.log('an open callback');
        } else if (toggled === false) {
          // ... like a close callback
          const color = `rgba(${modes.r},${modes.g},${modes.b},${this.color.colors.alpha})`;
          that.option = color;
          that._propagateChange(color);
          console.log('a close callback');
        } else {
          console.log('rendering');
          // rendering...
        }
      },
    });
    // $(this._elementRef.nativeElement).colpick({
    //   layout: 'rgbhex',
    //   color: this.option ? this.option.slice(1) : '112233',
    //   livePreview: 0,
    //   onSubmit: (hsb, hex, rgb, el) => {
    //     // $(el).css('background-color', '#'+hex);
    //     this.option = hex;
    //     console.log(hex);
    //     this._propagateChange('#'+hex);
    //     $(el).colpickHide();
    //   },
    // });
  }

  ngOnDestroy(): void {
  }
}
