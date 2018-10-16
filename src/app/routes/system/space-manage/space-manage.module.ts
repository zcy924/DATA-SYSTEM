import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ReportDetailComponent } from './component/report-detail.component';
import { ReportManageComponent } from './component/report-manage/report-manage.component';
import { RoleManageComponent } from './component/role-manage/role-manage.component';
import { UserManageComponent } from './component/user-manage/user-manage.component';
import { ScreenManageComponent } from './component/screen-manage/screen-manage.component';
import { SpaceManageRoutingModule } from './space-manage.routing';
import { ReportModalComponent } from './component/report-manage/components/report-modal.component';
import { RoleModalComponent } from './component/role-manage/components/role-modal.component';
import { UserModalComponent } from './component/user-manage/components/user-modal.component';
import { AddScreenComponent } from './component/screen-manage/component/add-screen.component';
import { SpaceManageService } from './space-manage.service';
import { EditScreenComponent } from './component/screen-manage/component/edit-screen.component';

const components = [
  ReportDetailComponent,
  ReportManageComponent,
  RoleManageComponent,
  UserManageComponent,
  ScreenManageComponent,
];
const modals = [
  ReportModalComponent,
  RoleModalComponent,
  UserModalComponent,
  AddScreenComponent,
  EditScreenComponent,
];
@NgModule({
  imports: [SharedModule, SpaceManageRoutingModule],
  exports: [...components],
  declarations: [...components, ...modals],
  providers: [SpaceManageService],
  entryComponents: [...modals],
})
export class SpaceManageModule {}
