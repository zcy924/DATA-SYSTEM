import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { CreateCompanyComponent } from './create/create-company.component';

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

  constructor(private nzModel: NzModalService) { }

  ngOnInit() { }

  showModal(title): void {
    const modal = this.nzModel.create({
      nzTitle: `${title}`,
      nzContent: CreateCompanyComponent,
      nzWidth: '50%',
      nzStyle: {
        top: '10%'
      }
    });
  }
}
