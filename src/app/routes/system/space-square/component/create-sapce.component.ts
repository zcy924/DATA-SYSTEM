import { Component, OnInit } from '@angular/core';
import { NzFormatEmitEvent, NzMessageService, NzModalRef } from 'ng-zorro-antd';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SpaceSquareService } from '../space-square.service';

@Component({
  selector: 'app-create-space',
  templateUrl: './create-space.html',
  styles: [],
})
export class CreateSpaceComponent implements OnInit {

  isPublic = '0';
  space_desc = '';
  space_name = '';

  constructor(
    private service: SpaceSquareService,
    private message: NzMessageService,
    private modalRef: NzModalRef) {
  }

  ngOnInit() {
  }

  createSpace() {
    let params = {
      Space: {
        sapce_name: this.space_name,
        remark: this.space_desc,
        ispublic: this.isPublic,
        avatar: './assets/tmp/img/icon.png',
      },
    };

    this.service.createSpace(params).subscribe(res => {
      console.log(res);
      if (res['retCode'] === '00000') {
        this.message.success('添加空间成功！');
        this.modalRef.destroy('ok');
      } else {
        this.message.error('添加空间失败！');
      }
    });
  }
}
