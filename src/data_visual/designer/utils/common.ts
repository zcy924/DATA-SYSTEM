import * as _ from 'lodash';
import { Observable } from 'rxjs/internal/Observable';
import { Observer } from 'rxjs/internal/types';

/**
 * 获得最接近的能被10整除的数
 * @param num
 */
export function closestNum(num) {
  return Math.round(num * 0.1) * 10;
}

export function removeUndefined(obj) {
  if (_.isPlainObject(obj)) {
    const result = _.omitBy(obj, _.isUndefined);
    return _.mapValues(result, function(value, key, object) {
      return removeUndefined(value);
    });
  } else if (_.isArray(obj)) {
    return obj.map((item) => {
      return removeUndefined(item);
    });
  } else {
    return obj;
  }
}

/**
 * 获得图片资源的长宽信息
 * @param dataURL
 */
export function imageDimensions$(dataURL: string): Observable<{ width, height }> {
  return Observable.create(function subscribe(observer: Observer<{ width, height }>) {
    const image = new Image();
    image.onload = function() {
      observer.next({
        width: (<HTMLImageElement>this).naturalWidth,
        height: (<HTMLImageElement>this).naturalHeight,
      });
      observer.complete();
    };
    image.onerror = function(errEvent) {
      console.error('图片加载异常 获取长宽信息失败！');
      observer.error(errEvent);
    };
    image.src = dataURL;
  });
}
