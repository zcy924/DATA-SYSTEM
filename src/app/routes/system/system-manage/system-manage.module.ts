import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SystemManageService } from './system-manage.service';
import { SystemManageRoutingModule } from './system-manage.routing';
import { CompanisManageComponent } from './component/companis-manage.component';

import { NzModalService } from 'ng-zorro-antd';

import { CreateCompanyComponent } from './component/create/create-company.component';

const components = [
  CompanisManageComponent,
];
const modals = [CreateCompanyComponent];
@NgModule({
  imports: [SharedModule, SystemManageRoutingModule],
  exports: [...components],
  declarations: [...components,...modals],
  providers: [SystemManageService,NzModalService],
  entryComponents: [...modals],
})
export class SystemManageModule {}
