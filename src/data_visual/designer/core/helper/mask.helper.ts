export type RepaintMask = ($activatedElement: JQuery) => void;

/**
 * 刷新遮罩辅助元素
 * @param $maskWrapper
 */
export function repaintMaskGenerator($maskWrapper: JQuery): RepaintMask {
  const
    $maskLeft = $maskWrapper.find('.mask-left'),
    $maskRight = $maskWrapper.find('.mask-right'),
    $maskTop = $maskWrapper.find('.mask-top'),
    $maskBottom = $maskWrapper.find('.mask-bottom');

  return ($activatedElement: JQuery) => {
    const { left, top } = $activatedElement.position(),
      width = $activatedElement.outerWidth(),
      height = $activatedElement.outerHeight();
    $maskLeft
      .width(Math.max(0, left));
    $maskRight
      .css({
        left: left + width,
      });
    $maskBottom
      .width(width)
      .css({
        left: Math.max(0, left),
        top: top + height,
      });
    $maskTop
      .width(width)
      .height(Math.max(top, 0))
      .css({
        left: Math.max(0, left),
      });
  };
}
