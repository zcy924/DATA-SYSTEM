import { Runtime } from './runtime';
import { StandardCompRepo } from '../component.packages/standard';

const runtime = new Runtime();

runtime.addComponentRepository(StandardCompRepo);
