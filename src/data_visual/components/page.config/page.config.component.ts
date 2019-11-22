import {
  AfterViewInit,
  Component,
  EventEmitter,
  KeyValueDiffer,
  KeyValueDiffers, OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { BasePageConfig } from '@data-studio/shared';

@Component({
  selector: 'app-page-config',
  templateUrl: './page.config.component.html',
  styleUrls: ['./page.config.component.less'],
})
export class PageConfigComponent extends BasePageConfig implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild(NgForm) ngForm: NgForm;
  @Output() output = new EventEmitter();

  private _differ: KeyValueDiffer<any, any>;

  option = {
    text: '页面标题',
    auxiliaryLine: false,
    dimensionMode: 'standard',
    width: 960,
    height: 720,
    backgroundMode: 'built-in',
    backgroundColor: 'rgb(255,255,255)',
    backgroundClass: 'background1',
    backgroundCustom: {
      fileName: '',
      url: '',
      dataUrl: '',
    },
    themeMode: 'dark',
  };

  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };

  formatterWidth = value => `宽度 ${value}`;
  parserWidth = value => value.replace('宽度 ', '');
  formatterHeight = value => `高度 ${value}`;
  parserHeight = value => value.replace('高度 ', '');

  constructor(private _differs: KeyValueDiffers) {
    super();
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }

  get width() {
    return this.option.width;
  }

  get height() {
    return this.option.height;
  }

  dimensionModeChange(value) {
    switch (value) {
      case 'standard':
        this.option.width = 960;
        this.option.height = 720;
        break;
      case 'wide':
        this.option.width = 960;
        this.option.height = 540;
        break;
      case 'mobile':
        this.option.width = 380;
        this.option.height = 680;
        break;
      case 'custom':
        break;
    }
  }

  ngAfterViewInit() {
    let subscription = this.ngForm.valueChanges.pipe(debounceTime(200)).subscribe((value) => {
      const array = [], changes = this._differ.diff(value);
      if (changes) {
        changes.forEachRemovedItem((record) => {
          array.push({
            key: `remove.${record.key}`,
            oldValue: record.previousValue,
            newValue: record.currentValue,
            option: value,
          });
        });
        changes.forEachAddedItem((record) => {
          array.push({
            key: `add.${record.key}`,
            oldValue: record.previousValue,
            newValue: record.currentValue,
            option: value,
          });
        });
        changes.forEachChangedItem((record) => {
          array.push({
            key: record.key,
            oldValue: record.previousValue,
            newValue: record.currentValue,
            option: value,
          });
        });
      }
      if (array.length > 0) {
        this._batchTrigger(array);
      }
    });
    this.onDestroy(() => {
      subscription.unsubscribe();
      subscription = null;
    });
  }

  ngOnDestroy(): void {
    this.destroy();
  }

}

