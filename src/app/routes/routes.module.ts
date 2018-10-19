import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { RouteRoutingModule } from './routes-routing.module';
// dashboard pages
// passport pages

// single pages
import { UserLockComponent } from './passport/lock/lock.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';

import { PersonalCenterComponent } from './system/personal-center/personal-center.component';
import { SpaceSquareComponent } from './system/space-square/space-square.component';
import { SpaceManageComponent } from './system/space-manage/space-manage.component';
import { SystemModule } from './system/system.module';
import { CompanyManageComponent } from './system/company-manage/company-manage.component';
import { PlatformManageComponent } from './system/platform-manage/platform-manage.component';

const COMPONENTS = [
  UserLockComponent,
  Exception403Component,
  Exception404Component,
  Exception500Component,
];
const COMPONENTS_NOROUNT = [
  PersonalCenterComponent,
  SpaceSquareComponent,
  SpaceManageComponent,
  CompanyManageComponent,
  PlatformManageComponent,
];

@NgModule({
  imports: [SharedModule, RouteRoutingModule, SystemModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class RoutesModule {}
