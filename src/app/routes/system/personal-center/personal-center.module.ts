import { NgModule } from '@angular/core';
import { ReportCollectComponent } from './report-collect/report-collect.component';
import { ScreenCollectComponent } from './screen-collect/screen-collect.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { PersonalCenterRoutingModule } from './personal-center.routing';
import { SharedModule } from '@shared/shared.module';
import { PersonalCenterService } from './personal-center.service';
import {EditScreenCollectComponent} from "./screen-collect/component/edit-screen-collect.component";
import {ColorPickerModule} from "@shared/color-picker/color-picker.module";
import {DetailScreenComponent} from "./screen-collect/component/detail-screen.component";
const components = [
  ReportCollectComponent,
  ScreenCollectComponent,
  UserInfoComponent,
  DetailScreenComponent
];
const modal = [
  EditScreenCollectComponent
]
@NgModule({
  imports: [SharedModule, PersonalCenterRoutingModule, ColorPickerModule],
  exports: [...components],
  declarations: [...components,...modal],
  entryComponents: [...modal],
  providers: [PersonalCenterService],
})
export class PersonalCenterModule {}
