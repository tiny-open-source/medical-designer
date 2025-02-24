let $LOW_CODE_FORM = {} as any;

function setConfig(option: any): void {
  $LOW_CODE_FORM = option;
}

const getConfig = (key: string): unknown => $LOW_CODE_FORM[key];

export { getConfig, setConfig };
