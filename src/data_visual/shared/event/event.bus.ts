import { BaseEventTarget } from './event';

type ICallback = (event: EventMessage) => void;

class EventType {
  private _eventName: string;
  private _tags: Array<string> = [];

  set eventName(param: string) {
    this._eventName = param;
  }

  addTag(tag: string) {
    this._tags.push(tag);
  }

  accept(eventType: string) {

  }
}

export class EventMessage {
  eventName: string;
  tags: Array<string> = [];

  constructor() {

  }
}

interface EventListener {
  listen(eventBus: EventBus);
}

export class EventBus extends BaseEventTarget {
  private static _instanceMap: Map<IPage, EventBus> = new Map();

  private _methodCache = new Map();

  static getInstance(page: IPage) {
    if (EventBus._instanceMap.has(page)) {
      return EventBus._instanceMap.get(page);
    } else {
      EventBus._instanceMap.set(page, new EventBus());
      return EventBus._instanceMap.get(page);
    }
  }

  private constructor() {
    super();
    this.addSubscription(() => {
      if (this._methodCache) {
        this._methodCache.clear();
        this._methodCache = null;
      }
    });
  }

  registerMethod(methodName: string, method: Function) {
    if (methodName && method) {
      this._methodCache.set(methodName, method);
    }
    return this;
  }

  invoke(methodName: string, ...params) {
    if (this._methodCache.has(methodName)) {
      try {
        this._methodCache.get(methodName).apply(null, params);
      } catch (e) {
        console.error(e);
      }
    }
  }
}


