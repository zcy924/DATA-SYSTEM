export interface IActionManager {
  canBackward: boolean;

  canForward: boolean;

  execute(action: IAction);

  backward();

  forward();
}

export interface IAction {

  forward();

  backward();
}
