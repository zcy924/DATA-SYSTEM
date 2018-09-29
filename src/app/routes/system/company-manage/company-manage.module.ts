import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CompanyManageService } from './company-manage.service';
import { CompanyManageRoutingModule } from './company-manage.routing';
import { CompanySettingComponent } from './component/company-setting.component';
import { SpaceSettingComponent } from './component/space-setting.component';
import { UserSettingComponent } from './component/user-setting.component';
import { CreateUserComponent } from './component/create/create-user.component';
import { NzModalService } from 'ng-zorro-antd';

const components = [
  CompanySettingComponent,
  SpaceSettingComponent,
  UserSettingComponent
];
const modals = [CreateUserComponent];
@NgModule({
  imports: [SharedModule, CompanyManageRoutingModule],
  exports: [...components],
  declarations: [...components,...modals],
  providers: [CompanyManageService,NzModalService],
  entryComponents: [...modals],
})
export class CompanyManageModule {}
