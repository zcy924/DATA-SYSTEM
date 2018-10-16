import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-space-setting',
  templateUrl: './space-setting.html'
})

export class SpaceSettingComponent implements OnInit {
  dataSet = [
    {
      key: '1',
      name: 'John Brown',
      avatar:'./assets/tmp/img/icon.png',
      address: ['New','Lake']
    },
    {
      key: '2',
      name: 'Jim Green',
      avatar:'./assets/tmp/img/icon.png',
      address: ['London','Lake','Park']
    },
    {
      key: '3',
      name: 'Joe Black',
      avatar:'./assets/tmp/img/icon.png',
      address: ['Sidney',' No.','1','Lake Park']
    }
  ];

  constructor() { }

  ngOnInit() { }
}
