import { SettingOutlined } from '@vicons/antd';
import {
  NButton,
  NIcon,
  NPopconfirm,
} from 'naive-ui';
import { defineComponent } from 'vue';
import ConfigButton from './ConfigButton';

export default defineComponent({
  name: 'Header',

  emits: ['newChat', 'settingSaved'],
  setup(_, { emit }) {
    return () => (
      <div class="lc-llm-chat-header">
        <div class="lc-llm-chat-header__container">
          <NPopconfirm
            onPositiveClick={() => emit('newChat')}
            v-slots={{
              trigger: () => (
                <NButton
                  size="small"
                  quaternary
                  v-slots={{
                    icon: () => (
                      <NIcon>
                        <SettingOutlined />
                      </NIcon>
                    ),
                  }}
                >
                  新聊天
                </NButton>
              ),
              positiveText: () => '确定',
              negativeText: () => '取消',
            }}
          >
            开启新聊天将清空当前聊天记录，是否继续？
          </NPopconfirm>
          <ConfigButton onSave={() => emit('settingSaved')} />
        </div>
      </div>
    );
  },
});
