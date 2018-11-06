import { Runtime } from './runtime';
import { Standard } from '../component.packages/standard';

const runtime = new Runtime();

runtime.addCompRepository(Standard);
