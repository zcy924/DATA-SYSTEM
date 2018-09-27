import { NgModule } from '@angular/core';
import { ReportCollectComponent } from './component/report-collect.component';
import { ScreenCollectComponent } from './component/screen-collect.component';
import { UserInfoComponent } from './component/user-info.component';
import { PersonalCenterRoutingModule } from './personal-center.routing';
import { SharedModule } from '@shared/shared.module';
import { PersonalCenterService } from './personal-center.service';
const components = [
  ReportCollectComponent,
  ScreenCollectComponent,
  UserInfoComponent,
];
@NgModule({
  imports: [SharedModule, PersonalCenterRoutingModule],
  exports: [...components],
  declarations: [...components],
  providers: [PersonalCenterService],
})
export class PersonalCenterModule {}