import { Component, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { NzFormatEmitEvent, NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd';

@Component({
  templateUrl: './report-detail.html',
  styles: [
    `
      .card {
        background-color: #fff;
        width: 100%;
        height: 310px;
        border-radius: 2px;
      }
      .title-tab {
        height: 32px;
        line-height: 32px;
        font-size: x-large;
      }
      .title-tab + div {
        float: right;
      }
      .title-tab + div a {
        height: 32px;
        line-height: 32px;
        font-size: x-large;
        padding-right: 24px;
        color: red;
      }
    `,
  ],
})
export class ReportDetailComponent implements OnInit {
  dataSet = [
    {
      key    : '1',
      name   : 'John Brown',
      age    : 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key    : '2',
      name   : 'Jim Green',
      age    : 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key    : '3',
      name   : 'Joe Black',
      age    : 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];




  @ViewChild('treeCom') treeCom;
  defaultCheckedKeys = [ '1001', '1002' ];
  defaultSelectedKeys = [ '10011' ];
  defaultExpandedKeys = [ '100', '1001' ];

  nodes: NzTreeNodeOptions[] = [ {
    title   : 'parent 1',
    key     : '100',
    children: [ {
      title   : 'parent 1-0',
      key     : '1001',
      disabled: true,
      children: [
        { title: 'leaf 1-0-0', key: '10010', disableCheckbox: true, isLeaf: true },
        { title: 'leaf 1-0-1', key: '10011', isLeaf: true, checked: true }
      ]
    }, {
      title   : 'parent 1-1',
      key     : '1002',
      children: [
        { title: 'leaf 1-1-0', key: '10020', isLeaf: true }
      ]
    } ]
  } ];

  nzClick(event: NzFormatEmitEvent): void {
    console.log(event, event.selectedKeys);
  }

  nzCheck(event: NzFormatEmitEvent): void {
    console.log(event, event.checkedKeys);
  }







  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      console.log(this.treeCom.getTreeNodes(), this.treeCom.getCheckedNodeList());
    }, 500);
    const mycharts = echarts.init(document.getElementById('echarts'));
    const option = {
      title: {
          text: '堆叠区域图'
      },
      tooltip : {
          trigger: 'axis',
          axisPointer: {
              type: 'cross',
              label: {
                  backgroundColor: '#6a7985'
              }
          }
      },
      legend: {
          data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
      },
      toolbox: {
          feature: {
              saveAsImage: {}
          }
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis : [
          {
              type : 'category',
              boundaryGap : false,
              data : ['周一','周二','周三','周四','周五','周六','周日']
          }
      ],
      yAxis : [
          {
              type : 'value'
          }
      ],
      series : [
          {
              name:'邮件营销',
              type:'line',
              stack: '总量',
              areaStyle: {},
              data:[120, 132, 101, 134, 90, 230, 210]
          },
          {
              name:'联盟广告',
              type:'line',
              stack: '总量',
              areaStyle: {},
              data:[220, 182, 191, 234, 290, 330, 310]
          },
          {
              name:'视频广告',
              type:'line',
              stack: '总量',
              areaStyle: {},
              data:[150, 232, 201, 154, 190, 330, 410]
          },
          {
              name:'直接访问',
              type:'line',
              stack: '总量',
              areaStyle: {normal: {}},
              data:[320, 332, 301, 334, 390, 330, 320]
          },
          {
              name:'搜索引擎',
              type:'line',
              stack: '总量',
              label: {
                  normal: {
                      show: true,
                      position: 'top'
                  }
              },
              areaStyle: {normal: {}},
              data:[820, 932, 901, 934, 1290, 1330, 1320]
          }
      ]
  };
  mycharts.setOption(option);

  }
}
