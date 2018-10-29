import { SettingsService } from '@delon/theme';
import { Component, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { TokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { StartupService } from '@core/startup/startup.service';
import { LoginService } from './login.service';
import { Md5 } from 'ts-md5';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.less'],
})
export class LoginComponent {
  validateForm: FormGroup;
  passwordMD5;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private settingsService: SettingsService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    private startupSrv: StartupService,
    private loginService: LoginService,
  ) {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  submitForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.invalid) {
      return;
    }
    // const params = this.validateForm.value;
    this.passwordMD5 = Md5.hashStr(
      this.validateForm.controls.password.value,
    ).toString();
    const params = {
      userNo: this.validateForm.controls.userName.value,
      password: this.passwordMD5,
    };
    this.loading = true;
    this.loginService.login(params).subscribe(
      data => {
        // if (data['retCode'] === '00000') {
        if (data['retCode'] === '00000') {
          // 清空路由复用信息
          this.reuseTabService.clear();
          // 设置Token信息
          this.tokenService.set({
            token: data['retData']['TokenID'],
          });
          this.settingsService.setUser({
            name: data.userName,
            avatar: data.userIcon,
            userNo: data.userNo,
            userId: data.userId,
            companyId: data.companyId,
            companyName: data.companyName,
            companyLogo: data.avatar,
            isCompanyAdmin: data.isCompanyAdmin === 'T' ? true : false,
          });
          // 重新获取 StartupService 内容，若其包括 User 有关的信息的话
          // this.startupSrv.load().then(() => this.router.navigate(['/']));
          // 否则直接跳转
          this.router.navigate(['/app/user']);
        } else {
          this.msg.error(data.retMsg);
          this.loading = false;
          return;
        }
      },
      (error) => {
        this.loading = false;
        if (error instanceof HttpResponse) {
          this.msg.error(error.body.retMsg);
        }
      },
    );

    // 设置Token信息
    // this.tokenService.set({
    //   token: 'asdawdawda',
    // });
    // this.settingsService.setUser({
    //   name: data.retData.userName,
    //   avatar: data.userIcon,
    //   account: data.userId,
    //   companyId: data.companyId,
    //   companyName: data.companyName,
    //   companyLogo: data.avatar,
    // });
    // 重新获取 StartupService 内容，若其包括 User 有关的信息的话
    this.startupSrv.load().then(() => this.router.navigate(['/']));
    // 否则直接跳转
    this.router.navigate(['/app/user']);
    // });
  }
}
