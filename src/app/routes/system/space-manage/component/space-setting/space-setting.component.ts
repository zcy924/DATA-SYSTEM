import {Component, AfterViewInit} from "@angular/core";
import {HttpResponse} from "@angular/common/http";
import {NzMessageService, UploadFile} from "ng-zorro-antd";
import {SpaceManageService} from "../../space-manage.service";
import {el} from "@angular/platform-browser/testing/src/browser_util";
import { environment } from '@env/environment';

@Component({
  templateUrl: './space-setting.html',
  styles: [`
    .title-tab {
      height: 32px;
      line-height: 32px;
      font-size: x-large;
    }`]
})
export class SpaceSettingComponent implements AfterViewInit {
  formModel = {
    spaceId: localStorage.getItem('spaceID'),
    spaceName: null,
    isPublic: null,
    remark: null,
    avatar: null
  };
  fileList = [];
  previewImage = '';
  previewVisible = false;
  loading;
  actionUrl = environment.SERVER_URL+'selfCore/selfInfo/pictureTest';

  constructor(private spaceManageService: SpaceManageService, private msg: NzMessageService) {

  }

  ngAfterViewInit() {
    this.getSpaceInfo();
  }

  getSpaceInfo() {
    this.spaceManageService.qrySpaceInfo({spaceId: localStorage.getItem('spaceID')}).subscribe(data => {
      this.formModel.spaceName = data.spaceName;
      if(data.avatar){
        this.fileList.push({
          uid: -1,
          name: 'avatar.png',
          status: 'done',
          url: data.avatar,
        });
      }
      this.formModel.isPublic = data.isPublic === 'T' ? true : false;
      this.formModel.remark = data.remark;
      this.formModel.avatar = data.avatar;
    })
  }

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
        this.formModel.avatar = img;
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
      this.msg.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.msg.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
  };

  submit() {
    this.formModel.isPublic = this.formModel.isPublic ? 'F' : 'T';
    const params = Object.assign({}, this.formModel);
    this.spaceManageService.modSpaceInfo(params).subscribe(data => {
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
