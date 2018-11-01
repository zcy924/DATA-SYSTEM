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
  formModel = {
    userNo: null,
    userName: null,
    userIcon: null,
    phone: null,
    email: null
  };

  constructor(
    private perService: PersonalCenterService,
    private msg: NzMessageService,
    private personService: PersonalCenterService
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


  ngOnInit() {
    this.getUserInfo();
  }
  test() {
    this.perService.getUser().subscribe(data => {
      console.log(data);
    });
  }
  getUserInfo(){
    this.personService.getUserInfo({}).subscribe(data=>{
      this.formModel.userNo = data.userNo;
      this.formModel.userName = data.userName;
      this.formModel.userIcon = data.userIcon;
      this.formModel.phone = data.phone;
      this.formModel.email = data.email;
    })

  }
}
