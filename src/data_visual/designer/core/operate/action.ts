import { IDestroyable } from '@data-studio/shared';

export interface IActionManager {
  canBackward: boolean;

  canForward: boolean;

  execute(action: IAction);

  backward();

  forward();
}

export interface IAction extends IDestroyable {

  forward();

  backward();
}
