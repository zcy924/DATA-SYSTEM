import { Component, OnInit } from '@angular/core';
import {
  NzModalService,
  NzDropdownService,
  NzMessageService, UploadFile,
} from 'ng-zorro-antd';
import { CompanyManageService } from '../../company-manage.service';
import { HttpResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';


@Component({
  templateUrl: './company-setting.html',
  styles: [`
    .company-label {
      text-align: left
    }

  `],
})
export class CompanySettingComponent implements OnInit {
  companyName = '';
  admins = [];
  searchedAdmins = [];
  spaceNum = '';
  onlyAdmin;
  key = '';
  avater = '';

  constructor(
    private _companyService: CompanyManageService,
    private _message: NzMessageService,
  ) {
  }

  ngOnInit() {
    this.getCompanyInfo();
  }

  // 公司管理员复选框勾选
  updateChecked(user) {
    // 将取消勾选的用户置为false
    this.admins.forEach(res => {
      if (user.userNo === res.userNo) {
        res.checked = false;
      }
    });
    // 将取消勾选的用户的列表复选框置为false
    this.searchedAdmins.forEach(res => {
      if (user.userNo === res.userNo) {
        res.checked = false;
      }
    });
  }

  // 模糊查询复选框勾选
  searchChecked(user) {
    // 将用户锁定，并加入勾选数组
    user.checked = !user.checked;
    this.admins = this.admins.filter(res => !(res.userNo === user.userNo));
    this.admins.push(user);
  }

  // 查询公司信息
  getCompanyInfo() {
    let params = {};
    this._companyService.getCompanyInfo(params).subscribe(res => {
      if (res['retCode'] === '00000') {
        this.companyName = res['companyName'];
        this.admins = res['admins'];
        this.avater = res['avatar'];
        this.spaceNum = res['spaceNum'];
        this.onlyAdmin = res['onlyAdmin'] === 'T';
        this.admins.every(value => (value.checked = true));
        this.fileList.push({
          uid: -1,
          name: 'avatar.png',
          status: 'done',
          url: this.avater,
        });
      } else {
        this._message.error('查询失败！');
      }
    });
  }

  searchUsers() {
    if (this.key === '') {
      this.searchedAdmins = [];
      return;
    }
    let params = {
      key: this.key,
      pageSize: '100',
      curPage: '0',
      totalRow: '0',
      totalPage: '0',
    };
    this._companyService.searchFuzzyUsers(params).subscribe(
      res => {
        this.searchedAdmins = [];
        this.searchedAdmins = res['retList'];
        this.searchedAdmins.forEach(i => {
          i.checked = false;
          // 查询已被勾选的用户，将其锁定
          this.admins.forEach(j => {
            if (i.userNo === j.userNo && j.checked === true) {
              i.checked = !i.checked;
            }
          });
        });
      },
      error => {
        if (error instanceof HttpResponse) {
          this._message.error(error.body.retMsg);
        }
      },
    );
  }

  // 更新公司信息
  updateCompany() {
    let params = {
      companyName: this.companyName,
      onlyAdmin: this.onlyAdmin ? 'T' : 'F',
      avatar: this.avater,
      admins: this.admins.filter(admin => admin.checked),
    };
    this._companyService.updateCompanyInfo(params).subscribe(
      res => {
        this._message.success('更新公司信息成功！');
        this.getCompanyInfo();
      },
      error => {
        if (error instanceof HttpResponse) {
          this._message.error(error.body.retMsg);
        }
      },
    );
  }


  fileList = [];
  testUrl = environment.SERVER_URL + 'selfCore/selfInfo/pictureTest';
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
        this.avater = img;
      });
    }
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };


  beforeUpload = (file: File) => {
    const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png');
    if (!isJPG) {
      this._message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this._message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
  };

}
