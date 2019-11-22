import {
  AfterViewInit,
  Component,
  EventEmitter,
  KeyValueDiffer,
  KeyValueDiffers,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseConfigSourceComponent } from '@data-studio/shared';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-header-config',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
})
export class DataHeaderComponent extends BaseConfigSourceComponent implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;

  @Output() output = new EventEmitter();

  option = {
    size: 'h1',
    color: 'red',
    content: '我是标题',
    textAlign: 'center',
    textStyle: {
      fontSize:null,
      fontFamily: null,
      fontStyle: null,
      fontWeight: null,
    },
  };

  fontSizeArray = [10, 12, 14, 16, 18, 20, 24, 32, 40];

  headerSizeArray = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

  fontStyleArray = ['normal', 'italic', 'oblique'];

  fontFamilyArray = [
    ['serif', 'serif'],
    ['Courier New', 'Courier New'],
    ['楷体', 'KaiTi'],
    ['黑体', 'SimHei'],
    ['宋体', 'SimSun'],
    ['微软雅黑', 'Microsoft YaHei'],
    ['华文细黑', 'STXihei'],
    ['华文楷体', 'STKaiti'],
    ['华文宋体', 'STSong'],
    ['华文彩云', 'STCaiyun'],
    ['华文琥珀', 'STHupo'],
    ['华文隶书', 'STLiti'],
    ['华文行楷', 'STXingkai'],
  ];

  fontWeightArray = ['normal',
    'bold',
    'bolder',
    'lighter',
    100, 200, 300, 400, 500, 600, 800];

  private _differ: KeyValueDiffer<any, any>;

  constructor(private _differs: KeyValueDiffers) {
    super();
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }


  ngAfterViewInit() {
    this.ngForm.valueChanges.pipe(debounceTime(100)).subscribe((value) => {
      this._subject.next({
        key: 'option',
        oldValue: this.option,
        newValue: this.option,
        option: this.option,
      });
    });
  }

}
