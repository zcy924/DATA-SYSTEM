import { Observable } from 'rxjs/internal/Observable';
import { Observer } from 'rxjs/internal/types';

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
    image.src = dataURL;
  });
}
