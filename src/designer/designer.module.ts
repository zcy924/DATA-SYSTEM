import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {DesignerComponent} from './designer.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgZorroAntdModule, NZ_I18N, zh_CN} from 'ng-zorro-antd';
import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {DesignerLayoutModule} from './layout/designer.layout.module';
import {AppRoutingModule} from './app.routing';

registerLocaleData(zh);

@NgModule({
  declarations: [DesignerComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    DesignerLayoutModule,
    AppRoutingModule
  ],
  providers: [{provide: NZ_I18N, useValue: zh_CN}],
  bootstrap: [DesignerComponent]
})
export class DesignerModule {
}
