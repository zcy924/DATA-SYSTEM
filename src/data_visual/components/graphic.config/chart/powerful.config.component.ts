import {
  AfterViewInit,
  Component,
  KeyValueDiffer,
  KeyValueDiffers,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd';
import { BaseConfigSourceComponent } from '@data-studio/shared';

import { removeUndefined } from '../../../designer/utils/common';
import { debounceTime } from 'rxjs/operators';
import * as _ from 'lodash';
import { popupEditor } from '../../../designer/utils/popup.editor';

@Component({
  selector: 'app-powerful-config',
  templateUrl: './powerful.config.component.html',
  styleUrls: ['./powerful.config.component.less'],
})
export class PowerfulConfigComponent extends BaseConfigSourceComponent implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;

  option = {
    text: '',
  };

  private _differ: KeyValueDiffer<any, any>;

  private _innerOption = {};

  constructor(private modalService: NzModalService, private _differs: KeyValueDiffers) {
    super();
  }

  edit() {
    popupEditor.open('',(newValue:string)=>{
      if(!!newValue){
        this.option.text=newValue;
        this._subject.next({
          key: 'option',
          oldValue: this.option,
          newValue: this.option,
          option: this.option,
        });
      }
    });
  }

  exportOption() {
    return _.cloneDeep(this._innerOption);
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }

  ngAfterViewInit() {
    this.ngForm.valueChanges.pipe(debounceTime(200)).subscribe((value) => {
      value = removeUndefined(value);
      this._innerOption = value;
      this._subject.next({
        key: 'option',
        oldValue: this._innerOption,
        newValue: value,
        option: value,
      });

    });

  }


}

