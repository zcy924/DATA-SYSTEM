import { Inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent,
} from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { mergeMap, catchError, debounceTime, filter } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, TokenService } from '@delon/auth';
import * as _ from 'lodash';
import * as moment from 'moment';

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  RET_CODE = {
    SUCCESS: '00000',
    FAIL: 'FFFFF',
    PSD_ERROR: '000F0',
    PSD_EMPTY: '000F2',
    RESULT_EMPTY: '000F1',
    EXCEPTION: '000EE',
    TIMEOUT: '000TT',
    PARAM_ERROR: '00096',
    IN_REVIEW: '00099',
    EXISTED: '00098',
    RELATION_ERROR: '00094',
    DELETED: '00097',
    REPEAT_IP: '00095',
    RIGHT: '00100',
    PSW_FIRST: '000FL',
  };
  private msgChange$: BehaviorSubject<string> = new BehaviorSubject<string>(
    null,
  );

  constructor(
    private injector: Injector,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
  ) {
    this.msgChange$
      .pipe(
        debounceTime(1000),
        filter(value => !!value),
      )
      .subscribe(msg => this.msg.error(msg));
  }

  get msg(): NzMessageService {
    return this.injector.get(NzMessageService);
  }

  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private handleData(event: HttpResponse<any>): Observable<any> {
    // 可能会因为 `throw` 导出无法执行 `_HttpClient` 的 `end()` 操作
    this.injector.get(_HttpClient).end();
    const body = event.body;
    if (body && body.retCode) {
      if (
        body.retCode !== this.RET_CODE.SUCCESS &&
        body.retCode !== this.RET_CODE.PSW_FIRST
      ) {
        if (body.retCode === this.RET_CODE.TIMEOUT) {
          // this.session.clear();
          this.goTo('/');
        }
        // 继续抛出错误中断后续所有 Pipe、subscribe 操作，因此：
        // this.http.get('/').subscribe() 并不会触发
        return throwError(event);
      } else if (
        body.retCode === this.RET_CODE.SUCCESS &&
        _.isNumber(body.curPage)
      ) {
        body.curPage++;
      }
    }
    return of(event);
  }

  private handleError(
    event: HttpResponse<any> | HttpErrorResponse,
  ): Observable<any> {
    switch (event.status) {
      case 200:
        break;
      case 401: // 未登录状态码
        this.goTo('');
        break;
      case 0:
        this.msgChange$.next('服务器连接异常');
        break;
      case 403:
      case 404:
      case 500:
        this.goTo(`/${event.status}`);
      case 900:
      case 901:
        this.goTo('');
        break;
    }
    return throwError(event);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<| HttpSentEvent
    | HttpHeaderResponse
    | HttpProgressEvent
    | HttpResponse<any>
    | HttpUserEvent<any>> {
    // 统一加上服务端前缀
    let url = req.url;
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      // url = environment.SERVER_URL + url;
      url = 'http://' + url;
      console.log(url);
    }
    const newReq = req.clone({
      url: url,
      withCredentials: true,
      body: this.parseParams(req.body),
    });
    return next.handle(newReq).pipe(
      mergeMap((event: any) => {
        // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
        if (event instanceof HttpResponse && event.status === 200)
          return this.handleData(event);
        // 若一切都正常，则后续操作
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => this.handleError(err)),
    );
  }

  parseParams(requestBody: any) {
    const ret = Object.assign({}, requestBody);
    // tslint:disable-next-line:forin
    for (const key in requestBody) {
      let _data = requestBody[key];
      // 将时间转化为：字符串 (YYYY-MM-DD)
      if (_data instanceof Date) {
        _data = moment(_data || undefined).format('YYYY-MM-DD');
        ret[key] = _data;
      } else if (key == 'curPage') {
        const curPage = requestBody['curPage'];
        Object.assign(
          ret,
          _.isNumber(curPage) && curPage > 0 ? { curPage: curPage - 1 } : {},
        );
      }
    }
    return ret;
  }
}
