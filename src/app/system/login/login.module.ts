import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginService } from './login.service';
import { SharedModule } from '../../shared/shared.module';
const components = [LoginComponent];

@NgModule({
  imports: [FormsModule, ReactiveFormsModule, NgZorroAntdModule, CommonModule,SharedModule],
  exports: [...components],
  declarations: [...components],
  providers: [LoginService]
})
export class LoginModule {}
