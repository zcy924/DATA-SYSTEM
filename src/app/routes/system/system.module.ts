import { NgModule } from '@angular/core';
import { SystemRoutingModule } from './system.routing';
import { SharedModule } from '@shared/shared.module';
import { ReportCollectComponent } from './personal-center/component/report-collect.component';
import { ScreenCollectComponent } from './personal-center/component/screen-collect.component';
import { UserInfoComponent } from './personal-center/component/user-info.component';
import { SystemService } from './system.service';

const modules = [SharedModule, SystemRoutingModule];
const components = [ReportCollectComponent, ScreenCollectComponent, UserInfoComponent];
@NgModule({
  imports: [...modules],
  exports: [],
  declarations: [...components],
  providers: [SystemService],
})
export class SystemModule {}
