
import {FaceWrapper} from '../face/face.wrapper';
import { Container } from './container.interface';

export abstract class ContainerImmutable extends Container {
  protected _map: Map<string, FaceWrapper> = new Map();

  protected constructor(template: string) {
    super(template);
  }
}

