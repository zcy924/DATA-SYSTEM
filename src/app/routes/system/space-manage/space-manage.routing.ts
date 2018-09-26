import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportDetailComponent } from './component/report-detail.component';
import { ReportManageComponent } from './component/report-manage/report-manage.component';
import { ScreenManageComponent } from './component/screen-manage/screen-manage.component';
import { RoleManageComponent } from './component/role-manage/role-manage.component';
import { UserManageComponent } from './component/user-manage/user-manage.component';

const routes: Routes = [
  { path: 'report-detail/:reportId', component: ReportDetailComponent },
  { path: 'report-manage', component: ReportManageComponent },
  { path: 'screen-manage', component: ScreenManageComponent },
  { path: 'role-manage', component: RoleManageComponent },
  { path: 'user-manage', component: UserManageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpaceManageRoutingModule {}
