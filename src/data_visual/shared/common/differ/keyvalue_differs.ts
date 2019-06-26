
/**
 * A differ that tracks changes made to an object over time.
 *
 *
 */
export interface KeyValueDiffer<K, V> {
  /**
   * Compute a difference between the previous state and the new `object` state.
   *
   * @param object containing the new value.
   * @returns an object describing the difference. The return value is only valid until the next
   * `diff()` invocation.
   */
  diff(object: Map<K, V>): KeyValueChanges<K, V>|null;

  /**
   * Compute a difference between the previous state and the new `object` state.
   *
   * @param object containing the new value.
   * @returns an object describing the difference. The return value is only valid until the next
   * `diff()` invocation.
   */
  diff(object: {[key: string]: V}): KeyValueChanges<string, V>|null;
  // TODO(TS2.1): diff<KP extends string>(this: KeyValueDiffer<KP, V>, object: Record<KP, V>):
  // KeyValueDiffer<KP, V>;
}

/**
 * An object describing the changes in the `Map` or `{[k:string]: string}` since last time
 * `KeyValueDiffer#diff()` was invoked.
 *
 *
 */
export interface KeyValueChanges<K, V> {
  /**
   * Iterate over all changes. `KeyValueChangeRecord` will contain information about changes
   * to each item.
   */
  forEachItem(fn: (r: KeyValueChangeRecord<K, V>) => void): void;

  /**
   * Iterate over changes in the order of original Map showing where the original items
   * have moved.
   */
  forEachPreviousItem(fn: (r: KeyValueChangeRecord<K, V>) => void): void;

  /**
   * Iterate over all keys for which values have changed.
   */
  forEachChangedItem(fn: (r: KeyValueChangeRecord<K, V>) => void): void;

  /**
   * Iterate over all added items.
   */
  forEachAddedItem(fn: (r: KeyValueChangeRecord<K, V>) => void): void;

  /**
   * Iterate over all removed items.
   */
  forEachRemovedItem(fn: (r: KeyValueChangeRecord<K, V>) => void): void;
}

/**
 * Record representing the item change information.
 *
 *
 */
export interface KeyValueChangeRecord<K, V> {
  /**
   * Current key in the Map.
   */
  readonly key: K;

  /**
   * Current value for the key or `null` if removed.
   */
  readonly currentValue: V|null;

  /**
   * Previous value for the key or `null` if added.
   */
  readonly previousValue: V|null;
}

/**
 * Provides a factory for {@link KeyValueDiffer}.
 *
 *
 */
export interface KeyValueDifferFactory {
  /**
   * Test to see if the differ knows how to diff this kind of object.
   */
  supports(objects: any): boolean;

  /**
   * Create a `KeyValueDiffer`.
   */
  create<K, V>(): KeyValueDiffer<K, V>;
}

/**
 * A repository of different Map diffing strategies used by NgClass, NgStyle, and others.
 *
 */
export class KeyValueDiffers {
  /**
   * @deprecated v4.0.0 - Should be private.
   */
  factories: KeyValueDifferFactory[];

  constructor(factories: KeyValueDifferFactory[]) { this.factories = factories; }

  static create<S>(factories: KeyValueDifferFactory[], parent?: KeyValueDiffers): KeyValueDiffers {
    if (parent) {
      const copied = parent.factories.slice();
      factories = factories.concat(copied);
    }
    return new KeyValueDiffers(factories);
  }

  find(kv: any): KeyValueDifferFactory {
    const factory = this.factories.find(f => f.supports(kv));
    if (factory) {
      return factory;
    }
    throw new Error(`Cannot find a differ supporting object '${kv}'`);
  }
}
