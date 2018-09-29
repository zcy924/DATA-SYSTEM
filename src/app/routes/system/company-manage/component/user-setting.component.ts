import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { CreateUserComponent } from './create/create-user.component';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.html'
})

export class UserSettingComponent implements OnInit {
  dataSet = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];

  constructor(private nzModel: NzModalService) { }

  ngOnInit() { }

  showModal(title): void {
    const modal = this.nzModel.create({
      nzTitle: `${title}`,
      nzContent: CreateUserComponent,
      nzWidth: '50%',
      nzStyle: {
        top: '10%'
      }
    });
  }
}
