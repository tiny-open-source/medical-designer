import type { App } from 'vue';

import LFormCol from './container/Col.vue';
import LFormContainer from './container/Container.vue';
import LFormFieldset from './container/Fieldset.vue';
import LFormRow from './container/Row.vue';
import LFormTable from './container/Table.vue';
import LFormTabs from './container/Tabs.vue';
import LFormDialog from './Dialog.vue';
import LFieldsCheckbox from './fields/Checkbox.vue';
import LFieldsColorPicker from './fields/ColorPicker.vue';
import LFieldsDatepicker from './fields/Daterange.vue';
import LFieldsDisplay from './fields/Display.vue';
import LFieldsHidden from './fields/Hidden.vue';
import LFieldsLink from './fields/Link.vue';
import LFieldsNumber from './fields/Number.vue';
import LFieldRadioGroup from './fields/RadioGroup.vue';
import LFieldsSelect from './fields/Select.vue';
import LFieldsSwitch from './fields/Switch.vue';
import LFieldsText from './fields/Text.vue';
import LFieldsTreeSelect from './fields/TreeSelect.vue';
import LForm from './Form.vue';
import './theme/index.scss';

export { default as LFormCol } from './container/Col.vue';
export { default as LFormContainer } from './container/Container.vue';
export { default as LFormFieldset } from './container/Fieldset.vue';
export { default as LFormRow } from './container/Row.vue';
export { default as LFormTable } from './container/Table.vue';
export { default as LFormTabs } from './container/Tabs.vue';
export { default as LFormDialog } from './Dialog.vue';
export { default as LFieldsCheckbox } from './fields/Checkbox.vue';
export { default as LFieldsColorPicker } from './fields/ColorPicker.vue';
export { default as LFieldsDatepicker } from './fields/Daterange.vue';
export { default as LFieldsDisplay } from './fields/Display.vue';
export { default as LFieldsHidden } from './fields/Hidden.vue';
export { default as LFieldsLink } from './fields/Link.vue';
export { default as LFieldsNumber } from './fields/Number.vue';
export { default as LFieldRadioGroup } from './fields/RadioGroup.vue';
export { default as LFieldsSelect } from './fields/Select.vue';
export { default as LFieldsSwitch } from './fields/Switch.vue';
export { default as LFieldsText } from './fields/Text.vue';
export { default as LFieldsTreeSelect } from './fields/TreeSelect.vue';
export { default as LForm } from './Form.vue';
export * from './schema';

export { default as fieldProps } from './utils/fieldProps';
const defaultInstallOptions = {};

function install(app: App, options: any) {
  const option = Object.assign(defaultInstallOptions, options);

  app.config.globalProperties.$LOW_CODE_FORM = option;

  app.component(LFieldsText.name!, LFieldsText);
  app.component(LFormContainer.name!, LFormContainer);
  app.component(LFormTabs.name!, LFormTabs);
  app.component(LFieldsHidden.name!, LFieldsHidden);
  app.component(LFieldsDisplay.name!, LFieldsDisplay);
  app.component(LFieldsSelect.name!, LFieldsSelect);
  app.component(LFieldsSwitch.name!, LFieldsSwitch);
  app.component(LFormFieldset.name!, LFormFieldset);
  app.component(LFieldsCheckbox.name!, LFieldsCheckbox);
  app.component(LFieldsColorPicker.name!, LFieldsColorPicker);
  app.component(LFieldsNumber.name!, LFieldsNumber);
  app.component(LFormTable.name!, LFormTable);
  app.component(LFieldsLink.name!, LFieldsLink);
  app.component(LFieldsDatepicker.name!, LFieldsDatepicker);
  app.component(LFormDialog.name!, LFormDialog);
  app.component(LFormRow.name!, LFormRow);
  app.component(LForm.name!, LForm);
  app.component(LFieldRadioGroup.name!, LFieldRadioGroup);
  app.component(LFormCol.name!, LFormCol);
  app.component(LFieldsTreeSelect.name!, LFieldsTreeSelect);
  app.component('l-fields-img-upload', LFieldsText);
}

export default {
  install,
};
