import { Component, OnInit } from '@angular/core';
import { PersonalCenterService } from '../personal-center.service';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

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
    email: null,
  };
  actionUrl = environment.SERVER_URL+'selfCore/selfInfo/pictureTest';

  constructor(
    private perService: PersonalCenterService,
    private msg: NzMessageService,
    private personService: PersonalCenterService,
  ) {
  }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.personService.getUserInfo({}).subscribe(data => {
      this.formModel.userNo = data.userNo;
      this.formModel.userName = data.userName;
      this.formModel.userIcon = data.userIcon;
      this.formModel.phone = data.phone;
      this.formModel.email = data.email;
      if(data.userIcon){
        this.fileList.push({
          uid: -1,
          name: 'avatar.png',
          status: 'done',
          url: data.userIcon,
        });
      }
    });
  }

  fileList = [];
  previewImage = '';
  previewVisible = false;
  loading;

  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: UploadFile }): void {
    if (info.file.status === 'uploading') {
      this.loading = true;
      return;
    }
    if (info.file.status === 'done') {
      this.getBase64(info.file.originFileObj, (img: string) => {
        this.loading = false;
        this.formModel.userIcon = img;
      });
    }
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };


  beforeUpload = (file: File) => {
    const isJPG = (file.type === 'image/jpeg')||(file.type === 'image/png');
    if (!isJPG) {
      this.msg.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.msg.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
  };

  submit() {
    const params = Object.assign({}, this.formModel);
    this.personService.modUserInfo(params).subscribe(data => {
        this.msg.success('更新用户信息成功!');
      },
      err => {
        if (err instanceof HttpResponse) {
          this.msg.error(err.body.retMsg);
        }
      },
    );
  }
}
