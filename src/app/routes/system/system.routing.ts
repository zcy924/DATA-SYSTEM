import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportCollectComponent } from './personal-center/component/report-collect.component';
import { ScreenCollectComponent } from './personal-center/component/screen-collect.component';
import { UserInfoComponent } from './personal-center/component/user-info.component';


const routes: Routes = [
  { path: 'user-report', component: ReportCollectComponent },
  { path: 'user-screen', component: ScreenCollectComponent },
  { path: 'user-message', component: UserInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule {}
