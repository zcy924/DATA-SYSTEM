import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime, delay } from 'rxjs/operators';
import { Destroyable } from '../../shared/interface/destroyable';
import { RegionController } from '../../designer/core/region/region.controller';
import { IReportPage } from '../../designer/core/page/report/page.interface';
import { session } from '../../designer/utils/session';


@Component({
  selector: 'app-outline',
  templateUrl: './outline.component.html',
  styleUrls: ['./outline.component.less'],
})
export class OutlineComponent extends Destroyable implements AfterViewInit, OnDestroy {
  list: Array<any> = [];

  constructor() {
    super();
  }

  ngAfterViewInit() {
    let _regionArrayChangeSubscription: Subscription, _subscription = new Subscription();
    _subscription.add(session.pageChange.subscribe((currentPage: IReportPage) => {
      if (_regionArrayChangeSubscription) {
        _regionArrayChangeSubscription.unsubscribe();
        _subscription.remove(_regionArrayChangeSubscription);
      }
      _regionArrayChangeSubscription = currentPage
        .regionArray$.pipe(debounceTime(50),delay(100)).subscribe((regionArray: Array<RegionController>) => {
          console.log('regionArray', regionArray.length, regionArray);
          this.list = regionArray.map((region: RegionController) => {
            return region.invoke('desc');
          });
        });
      _subscription.add(_regionArrayChangeSubscription);
    }));
    this.onDestroy(() => {
      _subscription.unsubscribe();
    });
  }

  ngOnDestroy() {
    this.destroy();
  }
}

