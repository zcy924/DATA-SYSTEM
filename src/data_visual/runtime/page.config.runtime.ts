import { KeyValueDiffer, keyValueDiffers, BasePageConfigComponent } from '@barca/shared';


export class PageConfigRuntime extends BasePageConfigComponent {
  private _differ: KeyValueDiffer<any, any>;

  constructor() {
    super();
    this._differ = keyValueDiffers.find({}).create();
  }

  importOption(option: any) {
    this.option = option;

    const array = [],
      changes = this._differ.diff(option);
    if (changes) {
      changes.forEachRemovedItem((record) => {
        array.push({
          key: `remove.${record.key}`,
          oldValue: record.previousValue,
          newValue: record.currentValue,
          option
        });
      });
      changes.forEachAddedItem((record) => {
        array.push({
          key: `add.${record.key}`,
          oldValue: record.previousValue,
          newValue: record.currentValue,
          option
        });
      });
      changes.forEachChangedItem((record) => {
        array.push({
          key: record.key,
          oldValue: record.previousValue,
          newValue: record.currentValue,
          option
        });
      });
      array.push({
        key: 'option',
        oldValue: option,
        newValue: option,
        option
      });
    }
    if (array.length > 0) {
      this._batchTrigger(array);
    }
  }
}
