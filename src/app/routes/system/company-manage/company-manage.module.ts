import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CompanyManageService } from './company-manage.service';
import { CompanyManageRoutingModule } from './company-manage.routing';
import { CompanySettingComponent } from './component/company-setting/company-setting.component';
import { SpaceSettingComponent } from './component/space-setting/space-setting.component';
import { UserSettingComponent } from './component/user-setting/user-setting.component';
import { CreateUserComponent } from './component/user-setting/modal/create-user.component';
import { NzModalService } from 'ng-zorro-antd';
import { AdminModalComponent } from './component/space-setting/modal/admin-modal.component';
import { CreateSpaceComponent } from './component/space-setting/modal/create-sapce.component';

const components = [
  CompanySettingComponent,
  SpaceSettingComponent,
  UserSettingComponent
];
const modals = [CreateUserComponent,AdminModalComponent,CreateSpaceComponent];
@NgModule({
  imports: [SharedModule, CompanyManageRoutingModule],
  exports: [...components],
  declarations: [...components,...modals],
  providers: [CompanyManageService,NzModalService],
  entryComponents: [...modals],
})
export class CompanyManageModule {}
