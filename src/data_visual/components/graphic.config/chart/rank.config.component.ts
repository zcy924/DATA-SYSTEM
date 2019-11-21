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

@Component({
  selector: 'app-rank-config',
  templateUrl: './rank.config.component.html',
  styleUrls: ['./rank.config.component.less'],
})
export class RankConfigComponent extends BaseConfigSourceComponent implements AfterViewInit, OnInit {

  @ViewChild(NgForm) ngForm: NgForm;

  option: any = {
    backgroundColor: '#0e2147',
    title: {
      show: true,
      text: '排名',
      left: 'auto',
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      backgroundColor: 'transparent',
      textStyle: {
        align: 'left',
      },
    },
    grid: {
      left: '11%',
      top: '12%',
      right: '0%',
      bottom: '8%',
      containLabel: true,
    },
    dataset: {
      dimensions: ['score', 'name'],
      source: [
        {
          score: 4,
          name: '南昌转运中心',
        }, {
          score: 13,
          name: '广州转运中心',
        }, {
          score: 25,
          name: '杭州转运中心',
        }, {
          score: 29,
          name: '宁夏转运中心',
        }, {
          score: 38,
          name: '兰州转运中心',
        }, {
          score: 44,
          name: '南宁转运中心',
        }, {
          score: 50,
          name: '长沙转运中心',
        }, {
          score: 52,
          name: '武汉转运中心',
        }, {
          score: 60,
          name: '北京转运中心',
        }, {
          score: 72,
          name: '贵州转运中心',
        },
      ],
    },
    xAxis: [{
      show: false,
    }],
    yAxis: [{
      axisTick: 'none',
      axisLine: 'none',
      offset: '27',
      axisLabel: {
        textStyle: {
          color: '#ffffff',
          fontSize: '16',
        },
      },
      type: 'category',
      // data: ['南昌转运中心', '广州转运中心', '杭州转运中心', '宁夏转运中心', '兰州转运中心', '南宁转运中心', '长沙转运中心', '武汉转运中心', '合肥转运中心', '贵州转运中心'],
    }, {
      axisTick: 'none',
      axisLine: 'none',
      axisLabel: {
        textStyle: {
          color: '#ffffff',
          fontSize: '16',
        },
      },
      data: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'],
    }, {
      // name: '分拨延误TOP 10',
      // nameGap: '50',
      // nameTextStyle: {
      //   color: '#ffffff',
      //   fontSize: '16',
      // },
      axisLine: {
        lineStyle: {
          color: 'rgba(0,0,0,0)',
        },
      },
      data: [],
    }],
    series: [
      {
        name: '条',
        type: 'bar',
        yAxisIndex: 0,
        encode: {
          x: 'score',
          y: 'name',
        },
        label: {
          normal: {
            show: true,
            position: 'right',
            textStyle: {
              color: '#ffffff',
              fontSize: '16',
            },
          },
        },
        barWidth: 12,
        itemStyle: {
          normal: {
            color: null,
          },
        },
        z: 2,
      },
      {
        name: '白框',
        type: 'bar',
        yAxisIndex: 1,
        barGap: '-100%',
        data: [99.5, 99.5, 99.5, 99.5, 99.5, 99.5, 99.5, 99.5, 99.5, 99.5],
        barWidth: 20,
        itemStyle: {
          normal: {
            color: '#0e2147',
            barBorderRadius: 5,
          },
        },
        z: 1,
      },
      {
        name: '外框',
        type: 'bar',
        yAxisIndex: 2,
        barGap: '-100%',
        data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        barWidth: 24,
        itemStyle: {
          normal: {
            color: null,
            barBorderRadius: 5,
          },
        },
        z: 0,
      },
      {
        name: '外圆',
        type: 'scatter',
        hoverAnimation: false,
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        yAxisIndex: 2,
        symbolSize: 35,
        itemStyle: {
          normal: {
            color: null,
            opacity: 1,
          },
        },
        z: 2,
      },
    ],
  };

  private _differ: KeyValueDiffer<any, any>;

  private _innerOption = {};

  constructor(private modalService: NzModalService, private _differs: KeyValueDiffers) {
    super();
  }

  exportOption() {
    return _.cloneDeep(this._innerOption);
  }

  ngOnInit() {
    this._differ = this._differs.find(this.option).create();
  }

  ngAfterViewInit() {
    this.ngForm.valueChanges.pipe(debounceTime(100)).subscribe((value) => {
      value = removeUndefined(value);
      this._subject.next({
        key: 'option',
        oldValue: this._innerOption,
        newValue: this.option,
        option: this.option,
      });
      this._innerOption = this.option;

    });

  }


}

