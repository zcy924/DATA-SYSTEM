import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CompanyManageService } from './company-manage.service';
import { CompanyManageRoutingModule } from './company-manage.routing';
import { CompanySettingComponent } from './component/company-setting.component';
import { SpaceSettingComponent } from './component/space-setting.component';
import { UserSettingComponent } from './component/user-setting.component';

const components = [
  CompanySettingComponent,
  SpaceSettingComponent,
  UserSettingComponent
];
@NgModule({
  imports: [SharedModule, CompanyManageRoutingModule],
  exports: [...components],
  declarations: [...components],
  providers: [CompanyManageService],
})
export class CompanyManageModule {}
