import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ReportDetailComponent } from './component/report-detail.component';
import { ReportManageComponent } from './component/report-manage/report-manage.component';
import { RoleManageComponent } from './component/role-manage/role-manage.component';
import { UserManageComponent } from './component/user-manage/user-manage.component';
import { ScreenManageComponent } from './component/screen-manage/screen-manage.component';
import { SpaceManageRoutingModule } from './space-manage.routing';
import { CreateNewpageComponent } from './component/report-manage/components/create-newpage.component';
import { AddRoleComponent } from './component/role-manage/components/add-role.component';
import { AddUserComponent } from './component/user-manage/components/add-user.component';
import { AddScreenComponent } from './component/screen-manage/component/add-screen.component';
import { SpaceManageService } from './space-manage.service';
import { EditScreenComponent } from './component/screen-manage/component/edit-screen.component';
import { SpaceManageService } from './space-manage.service';
import { NzModalService } from 'ng-zorro-antd';

const components = [
  ReportDetailComponent,
  ReportManageComponent,
  RoleManageComponent,
  UserManageComponent,
  ScreenManageComponent,
];
const modals = [
  CreateNewpageComponent,
  AddRoleComponent,
  AddUserComponent,
  AddScreenComponent,
  EditScreenComponent,
];
@NgModule({
  imports: [SharedModule, SpaceManageRoutingModule],
  exports: [...components],
  declarations: [...components, ...modals],
  providers: [SpaceManageService],
  providers: [SpaceManageService,NzModalService],
  entryComponents: [...modals],
})
export class SpaceManageModule {}
