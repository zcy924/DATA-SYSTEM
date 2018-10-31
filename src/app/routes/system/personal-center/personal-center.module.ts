import { NgModule } from '@angular/core';
import { ReportCollectComponent } from './report-collect/report-collect.component';
import { ScreenCollectComponent } from './screen-collect/screen-collect.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { PersonalCenterRoutingModule } from './personal-center.routing';
import { SharedModule } from '@shared/shared.module';
import { PersonalCenterService } from './personal-center.service';
import {EditScreenCollectComponent} from "./screen-collect/component/edit-screen-collect.component";
const components = [
  ReportCollectComponent,
  ScreenCollectComponent,
  UserInfoComponent,
];
const modal = [
  EditScreenCollectComponent
]
@NgModule({
  imports: [SharedModule, PersonalCenterRoutingModule],
  exports: [...components],
  declarations: [...components,...modal],
  entryComponents: [...modal],
  providers: [PersonalCenterService],
})
export class PersonalCenterModule {}
