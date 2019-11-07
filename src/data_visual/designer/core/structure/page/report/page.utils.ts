export const VERSION_INFO = {
  get version() {
    return '1.0.0';
  },
  get versionPattern() {
    return /^\d+\.\d+\.\d+$/;
  },
  accept(versionNo: string): boolean {
    if (versionNo && this.versionPattern.test(versionNo)) {
      const [a, b, c] = versionNo.match(/\d+/g),
        [ta, tb, tc] = this.version.match(/\d+/g);
      if (a === ta && parseInt(tb) >= parseInt(b)) {
        return true;
      } else {
        return false;
      }

    } else {
      console.error('版本号格式错误:' + versionNo);
      return false;
    }

  },
};
