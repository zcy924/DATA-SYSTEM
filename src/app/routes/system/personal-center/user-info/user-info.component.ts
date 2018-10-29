import { Component, OnInit } from '@angular/core';
import { PersonalCenterService } from '../personal-center.service';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.html',
  styles: [
    `
      .ant-card-head {
        background-color: red;
      }
    `,
  ],
})
export class UserInfoComponent implements OnInit {

  constructor(
    private perService: PersonalCenterService,
    private msg: NzMessageService
  ) {}

  fileList = [
    {
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    }
  ];
  previewImage = '';
  previewVisible = false;


  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };


  ngOnInit() {}
  test() {
    this.perService.getUser().subscribe(data => {
      console.log(data);
    });
  }
}
