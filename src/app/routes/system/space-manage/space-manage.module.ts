import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ReportDetailComponent } from './component/report-detail/report-detail.component';
import { ReportManageComponent } from './component/report-manage/report-manage.component';
import { RoleManageComponent } from './component/role-manage/role-manage.component';
import { UserManageComponent } from './component/user-manage/user-manage.component';
import { ScreenManageComponent } from './component/screen-manage/screen-manage.component';
import { SpaceManageRoutingModule } from './space-manage.routing';
import { ReportModalComponent } from './component/report-manage/components/report-modal.component';
import { RoleModalComponent } from './component/role-manage/components/role-modal.component';
import { AddUserModalComponent } from './component/user-manage/components/add-user-modal.component';
import { AddScreenComponent } from './component/screen-manage/component/add-screen.component';
import { SpaceManageService } from './space-manage.service';
import { EditScreenComponent } from './component/screen-manage/component/edit-screen.component';
import { CompanyManageService } from '../company-manage/company-manage.service';
import { EditUserModalComponent } from './component/user-manage/components/edit-user-modal.component';
import { ScreenDetailComponent } from './component/screen-detail/screen-detail.component';
import { PersonalCenterService } from '../personal-center/personal-center.service';

import { ReportFolderModalComponent } from './component/report-detail/modal/report-folder-modal.component';
import { ReportKeepModalComponent } from './component/report-detail/modal/report-keep-modal.component';
import {SpaceSettingComponent} from "./component/space-setting/space-setting.component";
import {ApiManageComponent} from "./component/api-manage/api-manage.component";
import { ColorPickerModule } from '../../../../data_visual/components/shared/color-picker/color-picker.module';
import { ApiModalComponent } from './component/api-manage/modal/api-modal.component';
import {AceEditorDirective} from "./component/api-manage/ace-editor.directive";
import {DatabaseManageComponent} from "./component/database-manage/database-manage.component";
import { SpaceInfoComponent } from './component/space-info/space-info.component';

const components = [
  ReportDetailComponent,
  ReportManageComponent,
  RoleManageComponent,
  UserManageComponent,
  ScreenManageComponent,
  ScreenDetailComponent,
  SpaceSettingComponent,
  ApiManageComponent,
  AceEditorDirective,
  DatabaseManageComponent,
  SpaceInfoComponent
];
const modals = [
  ReportModalComponent,
  ReportKeepModalComponent,
  ReportFolderModalComponent,
  RoleModalComponent,
  AddUserModalComponent,
  EditUserModalComponent,
  AddScreenComponent,
  EditScreenComponent,
  ApiModalComponent
];
@NgModule({
  imports: [SharedModule, SpaceManageRoutingModule, ColorPickerModule],
  exports: [...components],
  declarations: [...components, ...modals],
  providers: [SpaceManageService,CompanyManageService,PersonalCenterService],
  entryComponents: [...modals],
})
export class SpaceManageModule {}
