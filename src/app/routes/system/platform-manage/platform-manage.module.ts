import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PlatformManageService } from './platform-manage.service';
import { PlatformManageRoutingModule } from './platform-manage.routing';
import { CompanisManageComponent } from './component/companis-manage.component';
import { NzModalService } from 'ng-zorro-antd';
import { CreateCompanyComponent } from './component/create/create-company.component';


const components = [
  CompanisManageComponent,
];
const modals = [CreateCompanyComponent];

@NgModule({
  imports: [SharedModule, PlatformManageRoutingModule],
  exports: [...components],
  declarations: [...components,...modals],
  providers: [PlatformManageService,NzModalService],
  entryComponents: [...modals],
})
export class PlatformManageModule {}
