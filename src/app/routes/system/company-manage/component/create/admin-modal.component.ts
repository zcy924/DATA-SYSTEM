import { Component, OnInit } from '@angular/core';
import { NzFormatEmitEvent, NzMessageService } from 'ng-zorro-antd';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CompanyManageService } from '../../company-manage.service';

@Component({
  selector: 'app-admin-modal',
  templateUrl: './admin-modal.html',
  styles: [],
})
export class AdminModalComponent implements OnInit {

  admins = [];
  newAdmins = [];
  spaceId = '';

  constructor(private companyManageService: CompanyManageService,
              private message: NzMessageService) {
  }

  ngOnInit() {
  }

  updateChecked(user) {
    user.checked = !user.checked;
  }

  updateAdmins() {
    let params = {
      spaceId: this.spaceId,
      admins: [

      ],
    };
    this.companyManageService.updateAdmins(params).subscribe(res => {
      console.log(res);
      if (res['retCode'] === '00000') {
        this.message.success('修改管理员成功！');
      } else {
        this.message.error('修改管理员失败！');
      }
    });
  }

  searchUsers() {

  }
}
