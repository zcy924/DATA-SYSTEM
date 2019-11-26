export type RepaintMask = ($activatedElement: JQuery, scale: number) => void;

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

  return ($activatedElement: JQuery, scale: number) => {
    const { left, top } = $activatedElement.position(),
      width = $activatedElement.outerWidth(),
      height = $activatedElement.outerHeight();
    $maskLeft
      .width(Math.max(0, left / scale));
    $maskRight
      .css({
        left: left / scale + width,
      });
    $maskBottom
      .width(width)
      .css({
        left: Math.max(0, left / scale),
        top: top / scale + height,
      });
    $maskTop
      .width(width)
      .height(Math.max(top / scale, 0))
      .css({
        left: Math.max(0, left / scale),
      });
  };
}
