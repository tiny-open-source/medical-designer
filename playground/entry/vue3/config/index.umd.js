(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.lowcodePresetConfigs = factory());
})(this, (function () { 'use strict';

  const page = [
    {
      text: "页面标识",
      name: "name",
      disabled: true,
      extra: "在多页面的情况下用来指定要打开的页面"
    },
    {
      text: "页面标题",
      name: "title"
    },
    {
      name: "layout",
      text: "容器布局",
      type: "select",
      defaultValue: "absolute",
      options: [
        { value: "absolute", text: "绝对定位" },
        { value: "relative", text: "流式布局" }
      ],
      onChange: (formState, v, { model }) => {
        if (!model.style)
          return v;
        if (v === "relative") {
          model.style.height = "auto";
        } else {
          const el = formState.stage?.renderer?.contentWindow.document.getElementById(model.id);
          if (el) {
            model.style.height = el.getBoundingClientRect().height;
          }
        }
      }
    }
  ];

  const text = [
    {
      name: "paramsKey",
      type: "treeSelect",
      // TODO 支持通过ajax获取选项，以下仅为测试值
      options: [
        {
          text: "Folder-1",
          value: "Folder-1-v",
          children: [
            {
              text: "File-1-1",
              value: "File-1-1-v"
            },
            {
              text: "Folder-1-2",
              value: "Folder-1-2-v",
              children: [
                {
                  text: "File-1-2-1",
                  value: "File-1-2-1-v"
                },
                {
                  text: "File-1-2-2",
                  value: "File-1-2-2-v"
                }
              ]
            }
          ]
        },
        {
          text: "Folder-2",
          value: "Folder-2-v",
          children: [
            {
              text: "File-2-1",
              value: "File-2-1-v"
            },
            {
              text: "File-2-2",
              value: "File-2-2-v"
            }
          ]
        }
      ],
      text: "参数键"
    },
    {
      name: "text",
      text: "文本"
    },
    {
      name: "multiple",
      text: "多行文本",
      type: "switch"
    }
  ];

  const container = [
    {
      name: "layout",
      text: "容器布局",
      type: "select",
      defaultValue: "absolute",
      options: [
        { value: "absolute", text: "绝对定位" },
        { value: "relative", text: "流式布局" }
      ],
      onChange: (formState, v, { model }) => {
        if (!model.style)
          return v;
        if (v === "relative") {
          model.style.height = "auto";
        } else {
          const el = formState.stage?.renderer?.contentWindow.document.getElementById(model.id);
          if (el) {
            model.style.height = el.getBoundingClientRect().height;
          }
        }
      }
    }
  ];

  const button = [
    {
      text: "文本",
      name: "text"
    }
  ];

  const overlay = [];

  const img = [
    {
      text: "图片",
      name: "src"
    },
    {
      text: "链接",
      name: "url"
    }
  ];

  const qrcode = [
    {
      text: "链接",
      name: "url"
    }
  ];

  const configs = {
    "page": page,
    "text": text,
    "container": container,
    "button": button,
    "overlay": overlay,
    "img": img,
    "qrcode": qrcode
  };

  return configs;

}));
//# sourceMappingURL=index.umd.js.map
