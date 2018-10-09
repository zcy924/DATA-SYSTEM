import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-companis-manage',
  templateUrl: './companis-manage.html'
})

export class CompanisManageComponent implements OnInit {
  dataSet = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: ['New','Lake']
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: ['London','Lake','Park']
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: ['Sidney',' No.','1','Lake Park']
    }
  ];

  constructor() { }

  ngOnInit() { }
}
