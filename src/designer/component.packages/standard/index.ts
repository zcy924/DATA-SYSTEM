import { ComponentRepository } from '../../interface/component.repository';

const compRepo = new ComponentRepository('标准组件库');

compRepo.register({
  key: 'bar.chart',
  paletteMeta: {},
  componentOption: {},
});

export const Standard = compRepo;
