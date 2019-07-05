import { TextAuxiliary } from './graphic.view/text.auxiliary';
import { Observable, Subscription } from 'rxjs';
import { DefaultGraphic } from '@data-studio/shared';

const template = `
<div class="graphic m-graphic m-graphic-text z-mode-edit">
  <div class="frame" style="border: 0px solid rgb(204, 204, 204); background-color: rgba(1, 1, 1, 0); border-radius: 0px; opacity: 1;">
  </div>
</div>
`;

export class TextGraphic extends DefaultGraphic {
  $element: JQuery;

  private _text: string;

  constructor() {
    super();
    this.$element = $(template);
  }

  init(wrapper: any) {
    this._view = new TextAuxiliary(this);
    this.$element.find('.frame').append(this._view.$element);
    this._modelEventTarget.register('option', (key, oldValue, newValue) => {
      console.log('option', newValue);
      this.update(newValue);
    });

    const accessor = wrapper.optionAccessor;
    wrapper.optionAccessor = () => {
      return Object.assign(accessor(), { configOption: { text: this._text } });
    };

    this._view.addEventListener('textChanged', (text) => {
      this._text = text;
    });
  }

  accept(modelSource: Observable<any>): Subscription {
    return modelSource.subscribe((modelArray: Array<any>) => {
      const [config, data] = modelArray;
      if (config) {
        console.log(JSON.stringify(config));
        this._modelEventTarget.trigger(config);
      }
    });
  }

  update(option: any) {
    if (this._view) {
      this._view.update(option);
    }
  }

}
