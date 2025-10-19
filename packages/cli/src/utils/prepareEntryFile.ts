import type App from '../Core';

import * as recast from 'recast';
import { EntryType } from '../types';

function makeCamelCase(name: string): string {
  if (typeof name !== 'string') {
    return '';
  }
  return name.replace(/-(\w)/g, ($0, $1) => $1.toUpperCase());
}

export function prepareEntryFile(app: App) {
  const { componentMap = {}, pluginMap = {}, configMap = {}, valueMap = {}, eventMap = {} } = app.moduleMainFilePath;
  const { componentFileAffix } = app.options;

  app.writeTemp('comp-entry.ts', generateContent(EntryType.COMPONENT, componentMap, componentFileAffix));
  app.writeTemp('plugin-entry.ts', generateContent(EntryType.PLUGIN, pluginMap));
  app.writeTemp('config-entry.ts', generateContent(EntryType.CONFIG, configMap));
  app.writeTemp('value-entry.ts', generateContent(EntryType.VALUE, valueMap));
  app.writeTemp('event-entry.ts', generateContent(EntryType.EVENT, eventMap));
}

function generateContent(type: EntryType, map: Record<string, string>, componentFileAffix = '') {
  const list: string[] = [];
  const importDeclarations: string[] = [];

  Object.entries(map).forEach(([key, packagePath]) => {
    const name = makeCamelCase(key);
    importDeclarations.push(
      `import ${name} from '${packagePath}${packagePath.endsWith(componentFileAffix) ? '' : componentFileAffix}'`,
    );
    list.push(`'${key}': ${name}`);
  });

  const exportToken = `${type}s`;

  return prettyCode(`${importDeclarations.join(';')}
    const ${exportToken}: Record<string, any> = {
      ${list.join(',')}
    }
    export default ${exportToken};
  `);
}

function prettyCode(code: string) {
  return recast.prettyPrint(recast.parse(code.replace(/\\/g, '/'), { parser: require('recast/parsers/typescript') }), {
    tabWidth: 2,
    trailingComma: true,
    quote: 'single',
  }).code;
}
