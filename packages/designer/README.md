# design

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

## Components

### Resizer Component

拖拽调节器组件，用于调整三栏布局中左右两列的宽度。

#### 特性

- **智能边界检查**: 自动限制列宽在合理范围内，确保中间列有足够的空间
- **最小宽度保护**: 防止列宽小于预设的最小值
- **流畅的视觉反馈**: 鼠标悬停和拖拽时提供清晰的视觉提示
- **响应式设计**: 在小屏幕设备上自动调整拖拽区域大小

#### 使用方式

```vue
<template>
  <div class="layout">
    <div class="left-panel">左侧面板</div>
    <Resizer type="left" />
    <div class="center-panel">中间面板</div>
    <Resizer type="right" />
    <div class="right-panel">右侧面板</div>
  </div>
</template>
```

#### 配置常量

可以通过 `ui.service.ts` 中导出的常量来调整默认行为：

- `MIN_LEFT_COLUMN_WIDTH`: 左侧列最小宽度 (默认: 60px)
- `MIN_RIGHT_COLUMN_WIDTH`: 右侧列最小宽度 (默认: 380px)
- `MIN_CENTER_COLUMN_WIDTH`: 中间列最小宽度 (默认: 200px)
- `DEFAULT_LEFT_COLUMN_WIDTH`: 左侧列默认宽度 (默认: 310px)
- `DEFAULT_RIGHT_COLUMN_WIDTH`: 右侧列默认宽度 (默认: 480px)

#### 样式定制

Resizer组件使用 `.lc-d-resizer` 类名，支持以下状态：

- `:hover` - 鼠标悬停状态
- `:active` 和 `.dragging` - 拖拽状态
- `::before` - 中间的拖拽指示器

可以通过覆盖这些样式来自定义外观。
