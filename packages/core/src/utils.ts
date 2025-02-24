export function style2Obj(style: string) {
  if (typeof style !== 'string') {
    return style;
  }

  return style.split(';').reduce((obj, element) => {
    if (!element)
      return obj;

    const [key, ...valueParts] = element.split(':');
    if (!key)
      return obj;

    const formattedKey = key.trim().split('-').map((v, i) => i > 0 ? `${v[0].toUpperCase()}${v.slice(1)}` : v).join('');
    const formattedValue = valueParts.join(':').trim();

    obj[formattedKey] = formattedValue;
    return obj;
  }, {} as Record<string, any>);
}

export function fillBackgroundImage(value: string) {
  if (value && !value.startsWith('url') && !value.startsWith('linear-gradient')) {
    return `url(${value})`;
  }
  return value;
}
export const isNumber = (value: string) => /^-?\d+(?:\.\d+)?$/.test(value);
