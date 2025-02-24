class Env {
  isIos = false;
  isIphone = false;
  isIpad = false;
  isAndroid = false;
  isAndroidPad = false;
  isMac = false;
  isWin = false;
  isMqq = false;
  isWechat = false;
  isWeb = false;

  constructor(ua = globalThis.navigator.userAgent, options: Record<string, boolean | string> = {}) {
    this.isIphone = ua.includes('iPhone');

    this.isIpad = /iPad.*OS\s[\d_]+/.test(ua);

    this.isIos = this.isIphone || this.isIpad;

    this.isAndroid = ua.includes('Android');

    this.isAndroidPad = this.isAndroid && !ua.includes('Mobile');

    this.isMac = ua.includes('Macintosh');

    this.isWin = ua.includes('Windows');

    this.isMqq = /QQ\/[\d.]+/.test(ua);

    this.isWechat = ua.includes('MicroMessenger') && !ua.includes('wxwork');

    this.isWeb = !this.isIos && !this.isAndroid && !/WebOS|BlackBerry/.test(ua);

    Object.entries(options).forEach(([key, value]) => {
      (this as any)[key] = value;
    });
  }
}

export default Env;
