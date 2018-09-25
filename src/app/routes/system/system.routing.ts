import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalCenterComponent } from './personal-center/personal-center.component';
import { SpaceSquareComponent } from './space-square/space-square.component';

const routes: Routes = [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  { path: 'user', component: PersonalCenterComponent },
  { path: 'square', component: SpaceSquareComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule {}
