# CHANGELOG

## [1.1.2](https://github.com/tiny-open-source/low-code-platform/compare/v1.1.1...v1.1.2) (2025-02-23)


### Bug Fixes

* 修复类型定义，将mockDSL强制转换为any类型 ([f559b5d](https://github.com/tiny-open-source/low-code-platform/commit/f559b5dcb0140de0cfbba3e0df09310772fc63cc))


### Features

* 添加AI模块功能，更新依赖，优化组件结构，清理无用代码 ([fbf6a8f](https://github.com/tiny-open-source/low-code-platform/commit/fbf6a8fa0d3afffe3e56c7d39ae347fb183dc0ed))
* 优化代码编辑器功能，添加防抖处理，更新模型管理，清理无用代码 ([0ec63e0](https://github.com/tiny-open-source/low-code-platform/commit/0ec63e070a4f4e67357f3828dcb132cfa3bf7c46))
* 优化样式重置，更新组件布局，添加AI面板功能 ([8fafd8f](https://github.com/tiny-open-source/low-code-platform/commit/8fafd8f4a50e191e7413409fbc61000e8b2f95cc))
* **ai:** 添加AI模块及相关配置，包含构建脚本和类型定义 ([17b6a55](https://github.com/tiny-open-source/low-code-platform/commit/17b6a559ad1c5c14ac2199a08cc6173f35186d71))
* **dsl-resolver:** 更新解析逻辑以支持渐变和颜色填充，重构样式处理 ([6f262fa](https://github.com/tiny-open-source/low-code-platform/commit/6f262faea2ea1b2796d675491440d5f5b164066a))
* **playground:** 更新页面标题并添加图标组件 ([2b255f9](https://github.com/tiny-open-source/low-code-platform/commit/2b255f92af19a4c70fa126e555317529b8a02087))



## [1.1.1](https://github.com/tiny-open-source/low-code-platform/compare/v1.1.0...v1.1.1) (2025-02-13)


### Bug Fixes

* **designer:** 优化根节点变更处理逻辑 ([0cf4ff6](https://github.com/tiny-open-source/low-code-platform/commit/0cf4ff690174f01423326ead987f17f0b64acd13))


### Features

* **tree-select:** 添加树形选择组件及相关配置 ([6ad588a](https://github.com/tiny-open-source/low-code-platform/commit/6ad588adac3b376b7140cb9fb149b88937756800))



# [1.1.0](https://github.com/tiny-open-source/low-code-platform/compare/v1.1.0-alpha.1...v1.1.0) (2025-02-09)


### Bug Fixes

* **core:** 修复方法调用的实例引用问题 ([f2ceb24](https://github.com/tiny-open-source/low-code-platform/commit/f2ceb242af1c93de3e8b057973f4b348e797fe66))
* **designer&stage:** 解决热更新问题 ([dc01cff](https://github.com/tiny-open-source/low-code-platform/commit/dc01cff6869309211b7f028a01bcf9b4a8290929))
* **designer:** 修复删除节点时界面未触发响应式更新的问题 ([a1874f0](https://github.com/tiny-open-source/low-code-platform/commit/a1874f0fbc1622bcf56e3daf4d6eb3a31ada334d))
* error import ([f218b62](https://github.com/tiny-open-source/low-code-platform/commit/f218b620473e26930feac7ef7a913c5f3eb4f823))
* **playground:** type ([d335c7d](https://github.com/tiny-open-source/low-code-platform/commit/d335c7d66139bbb46fccb3371d70c932abe08766))


### Features

* add figma json 解析 ([937d84e](https://github.com/tiny-open-source/low-code-platform/commit/937d84e8f5248af4061dfddfc00031e22f5b4368))
* **deps:** update deps ([f43ff1b](https://github.com/tiny-open-source/low-code-platform/commit/f43ff1bb1e1ba0ca075e2e9fc2b98dec2d14a95f))
* **dsl-resolver:** 初始化 dsl-resolver 包并添加基本功能 ([65af9d4](https://github.com/tiny-open-source/low-code-platform/commit/65af9d4e8cae25882d968ff7d08d516a7b89b60a))
* **dsl-resolver:** 导出 FigmaParser 并更新依赖版本 ([418c0df](https://github.com/tiny-open-source/low-code-platform/commit/418c0df2c54201d0d5fe40b203f67e8e4c39e0a4))
* **dsl-resolver:** figma json parse ([87c30a2](https://github.com/tiny-open-source/low-code-platform/commit/87c30a225f179e1b7930381b995cfd45e6edd2c3))
* **playground:** 添加路由配置 ([3d5768f](https://github.com/tiny-open-source/low-code-platform/commit/3d5768fdcd7f8904e567e617b86a55b27c79058c))
* **playground:** 新增从蓝湖一键导入dsl的功能 ([6011aec](https://github.com/tiny-open-source/low-code-platform/commit/6011aecf130ae223c7ec70384eda9cf5c1451407))



# [1.1.0-alpha.1](https://github.com/tiny-open-source/low-code-platform/compare/v1.0.4...v1.1.0-alpha.1) (2025-02-02)


### Bug Fixes

* **core:** 解决固定元素失效问题 ([af5c715](https://github.com/tiny-open-source/low-code-platform/commit/af5c7158afe82ea1b6f70a8062b06c2d19023a7a))
* **designer,stage,ui,runtime:** 流式布局下，height自动设置成auto ([f176dc4](https://github.com/tiny-open-source/low-code-platform/commit/f176dc43df300924ee9ca8ee9bc9e85a2207e605))
* **designer:** 复制页面错误 ([1d746a1](https://github.com/tiny-open-source/low-code-platform/commit/1d746a11ecda973e04fd32f6a3d521aead493f7b))
* **designer:** 画布缩放后，拖入组件位置错位 ([42ec366](https://github.com/tiny-open-source/low-code-platform/commit/42ec366e8367250d07ea7e42cd1ba71a26c86b21))
* **designer:** 画布右键菜单中粘贴按钮显示条件修改 ([0601a24](https://github.com/tiny-open-source/low-code-platform/commit/0601a246c3cf0a34e5a0d4869dd8019b36b55d56))
* **designer:** 没有页面时，添加页面出错 ([5054a96](https://github.com/tiny-open-source/low-code-platform/commit/5054a96f9b9981caa537bc8766863a1d3b189aa3))
* **designer:** 删除节点后，标记父节点为修改状态 ([3cbb097](https://github.com/tiny-open-source/low-code-platform/commit/3cbb0977ca353e4c5231c0c8eb47cce2c0c0429e))
* **designer:** 上移一层通知runtime更新参数出错 ([9282fae](https://github.com/tiny-open-source/low-code-platform/commit/9282fae62feef721f80db720193e0b10e2bca591))
* **designer:** 水平居中添加了两个历史堆栈 ([3a8ee64](https://github.com/tiny-open-source/low-code-platform/commit/3a8ee64cbc9a7843d76d54feaa6874b0400bd599))
* **designer:** 添加组件粘贴操作支持偏移量 ([befbdf1](https://github.com/tiny-open-source/low-code-platform/commit/befbdf13adc85d9ee45f9d813d0bfbade9225b7c))
* **designer:** 添加remove事件时的参数 ([1f8d172](https://github.com/tiny-open-source/low-code-platform/commit/1f8d172c70059405dee15c894540436169496100))
* **designer:** 拖拽改变父容器时错乱现象 ([3ba272e](https://github.com/tiny-open-source/low-code-platform/commit/3ba272e00cbabe4e3cad3b9af6d8153e0cf7a5bf))
* **designer:** 修复切换分辨率滚动条还存在的问题 ([dade59d](https://github.com/tiny-open-source/low-code-platform/commit/dade59d354461b4a13ce716dfc53cbf4f99ec28d))
* **designer:** 修复先单击选中页面,再进行多选无法选中的问题 ([b3c38bf](https://github.com/tiny-open-source/low-code-platform/commit/b3c38bf7c73a8ba98cd2cc70d9098b7bd1344855))
* **designer:** 修复Add返回数组还是对象的逻辑 ([05f4b7c](https://github.com/tiny-open-source/low-code-platform/commit/05f4b7c87719bb788943866bb5878ccaef0bb59a))
* **designer:** 组件属性表单配置默认值 ([c14e1a0](https://github.com/tiny-open-source/low-code-platform/commit/c14e1a039f0fe0bfc71c8171fb0c8349af4b38a0))
* **designer:** icon 图片模式样式修改 ([5bee64e](https://github.com/tiny-open-source/low-code-platform/commit/5bee64e086b3de9b2263820f157d04086903874a))
* **designer:** id可能重复 ([6fef441](https://github.com/tiny-open-source/low-code-platform/commit/6fef4417d5873c89465cea1953dc507075e897d1))
* **playground,runtime:** 拖动添加弹窗时初始位置不对 ([1ea6204](https://github.com/tiny-open-source/low-code-platform/commit/1ea62042ee450a06efc98edfce9a0ddfbc07a8f5))
* **stage:** 单选后，粘贴多个组件，原来的单选状态没有取消 ([3e107a1](https://github.com/tiny-open-source/low-code-platform/commit/3e107a15b6cea6d555f1dfd77f1f95e1d9d5295b))
* **stage:** 多选时禁止拖出边界 ([042de36](https://github.com/tiny-open-source/low-code-platform/commit/042de369e1c8548a7e9b1e8b05bb2fe3e8861c4b))
* **stage:** 流式布局resize从上或者左边调整，选中框出现错位 ([f8824a2](https://github.com/tiny-open-source/low-code-platform/commit/f8824a24bfeed3bdfe1d876eb8de2558e1f3199e))
* **stage:** 修复多选组件处于拖拽状态时画布组件命中高亮的问题，优化多选拖拽体验 ([e725cb2](https://github.com/tiny-open-source/low-code-platform/commit/e725cb2da6362ae678b6dd861d75ac0e404e7b47))
* **stage:** 修复非多选状态下，点击选中组件切换为普通选中状态 ([9e628e6](https://github.com/tiny-open-source/low-code-platform/commit/9e628e6a7ddcdca0684ae53e5947bdf256800f1e))
* type ([9d0d349](https://github.com/tiny-open-source/low-code-platform/commit/9d0d3492801c5e20ce6ddc1e7962f8f3a537cf0a))
* **ui,runtime:** 组件注册默认以low-code-runtime-ui-xx的形式，不再需要在组件中设置name ([812d87c](https://github.com/tiny-open-source/low-code-platform/commit/812d87c6b7e8ca344c9a409fda04e3d9e40641ff))


### Features

* **cli, runtime:** 优化入口配置文件生成 ([6bf68fa](https://github.com/tiny-open-source/low-code-platform/commit/6bf68facfe3b88fb23b6879cb0b13de1b2ceced1))
* **cli:** 生成的entry文件不再在window挂对象，通过构建自动挂载 ([0c135eb](https://github.com/tiny-open-source/low-code-platform/commit/0c135eb45a71f46d4301c12f70c79c31194e7bed))
* **cli:** 添加onInit/onPrepare配置 ([da2c7ad](https://github.com/tiny-open-source/low-code-platform/commit/da2c7adb0c8fe5f30b64aaa3d502f730f56ae5bd))
* **cli:** 添加onInit/onPrepare配置 ([bb9e6b2](https://github.com/tiny-open-source/low-code-platform/commit/bb9e6b23a69afcef4e4323e693cf77654a614870))
* **cli:** 新增lowcode-cli,用于runtime 入口配置文件生成 ([6c8e414](https://github.com/tiny-open-source/low-code-platform/commit/6c8e414eb395226d58917d0660fc7d8ca68bd464))
* **cli:** 支持配置temp文件夹，默认.lowcode ([46d2d7f](https://github.com/tiny-open-source/low-code-platform/commit/46d2d7f747140eed24c7a1762a19a202d240121c))
* **cli:** 支持temp下的config.ts配置文件，该模式下的配置文件会默认被删掉 ([9c80815](https://github.com/tiny-open-source/low-code-platform/commit/9c80815e6f2fe4a480fc59c385e665b6647bb7c1))
* **cli:** 自动install组件包，支持pnpm,npm,yarn ([478f062](https://github.com/tiny-open-source/low-code-platform/commit/478f062579b709b18f452d1b10ef6f1a6cf8883c))
* **core:** 新增store ([331c67c](https://github.com/tiny-open-source/low-code-platform/commit/331c67c78bc83c9b7864986c5dc494930c124f3f))
* **core:** 旋转角度支持配置不带单位的数值 ([4a60f88](https://github.com/tiny-open-source/low-code-platform/commit/4a60f88e3c3b28a45cf194e85f62b77ead8c319f))
* **designer,stage:** 多选支持居中操作 ([a3cf22d](https://github.com/tiny-open-source/low-code-platform/commit/a3cf22da586a4907f151d926c50b75a1fbd0b3f6))
* **designer,stage:** runtime-api中的add/update/remove中的参数加上parentId ([a4d65c1](https://github.com/tiny-open-source/low-code-platform/commit/a4d65c107674642c9c7575610a1d669be9e83205))
* **designer:** 编辑器销毁后销毁services ([7112205](https://github.com/tiny-open-source/low-code-platform/commit/7112205e20790a6869389f0f6901e36dbc215a3c))
* **designer:** 创建新组件时的顺序 ([9af67f4](https://github.com/tiny-open-source/low-code-platform/commit/9af67f48e94725aa08f9330e22483cf9d6eb96da))
* **designer:** 多选菜单支持复制粘贴删除 ([6ca1497](https://github.com/tiny-open-source/low-code-platform/commit/6ca1497bd5fd55efb1543510f5b7fc2385c5f012))
* **designer:** 多选粘贴后同步选中粘贴的多个元素,并支持拖拽,粘贴删除支持多个元素同时撤销到上一步 ([a1c199d](https://github.com/tiny-open-source/low-code-platform/commit/a1c199dcb7717153ec7449a80e50b8953f3583ee))
* **designer:** 画布添加滚动条 ([52d4b03](https://github.com/tiny-open-source/low-code-platform/commit/52d4b03887e51a592fa4a306405ba1a147332b93))
* **designer:** 去掉画布根据视窗大小自动调整缩放比例，加上缩放到实际大小/缩放以适应菜单按钮 ([8409cd9](https://github.com/tiny-open-source/low-code-platform/commit/8409cd9580e7b28e63f344a3c5b62ca266900497))
* **designer:** 添加stage slot ([1ffdf20](https://github.com/tiny-open-source/low-code-platform/commit/1ffdf204650f4ce40348c8695fee6b66568f6ad5))
* **designer:** 添加storageService服务 ([8c8213f](https://github.com/tiny-open-source/low-code-platform/commit/8c8213fc3c7fca6296ffb54c33c77c4f14652a69))
* **designer:** 完善storageService功能 ([d9d68a7](https://github.com/tiny-open-source/low-code-platform/commit/d9d68a72255c79006e77c946343dda4d8ca774bc))
* **designer:** 样式表单优化 ([090dbb5](https://github.com/tiny-open-source/low-code-platform/commit/090dbb50d70ed88d7971f7d8a5e91ffa780641ef))
* **designer:** designerService.add支持添加多个组件 ([dda568e](https://github.com/tiny-open-source/low-code-platform/commit/dda568e095928b377423aaedaceb54f13459f808))
* **designer:** propsService添加fillConfig方法，支持扩展 ([4fd4fdb](https://github.com/tiny-open-source/low-code-platform/commit/4fd4fdb010d3eb8d31984a90cdc297ba9643118a))
* **designer:** runtime add api中parent参数加回去 ([a4a1bc8](https://github.com/tiny-open-source/low-code-platform/commit/a4a1bc8ac3c6bbca0f349bc1b676697c2f302303))
* **form:** add daterange field ([8a3701d](https://github.com/tiny-open-source/low-code-platform/commit/8a3701d1f4a6d3796f662004294665fe48852f39))
* release script ([6903c61](https://github.com/tiny-open-source/low-code-platform/commit/6903c6156a9dab3ef68d9a7ac6440affe54a3994))
* **runtime,playground:** vue3使用lowcode-cli生成组件依赖入口 ([79ac6f5](https://github.com/tiny-open-source/low-code-platform/commit/79ac6f5c98dbd1ee02c4d3a74835b9c02e4bf13d))
* **sidebar:** 已选组件增加右键快捷菜单 ([7805a3a](https://github.com/tiny-open-source/low-code-platform/commit/7805a3a79ea73ba8aee73a4f4efdd130534d8c59))
* **stage,designer:** 拖入指定容器支持配置成按住alt才开启 ([3ab3ed9](https://github.com/tiny-open-source/low-code-platform/commit/3ab3ed980c2eb001cdb61a007522094e4467ad17))
* **stage,runtime:** 去掉runtime getSnapElements 定义 ([3397903](https://github.com/tiny-open-source/low-code-platform/commit/33979039cd1cfc5ea8da2c81f43abded097383ab))
* **stage:** 多选快捷键改成ctrl/cmd ([81c990a](https://github.com/tiny-open-source/low-code-platform/commit/81c990a08d276d65bc31ac6d5be60c4ba02f6ed0))
* **stage:** 多选支持resize ([29fdd0a](https://github.com/tiny-open-source/low-code-platform/commit/29fdd0a111a442d929afa8f451314bc266adba6d))
* **stage:** 暂时禁用多选resizable ([6915d5d](https://github.com/tiny-open-source/low-code-platform/commit/6915d5dcb51e97754d171e26b4696114d497dba9))
* **utils:** moment换成dayjs ([25a3e9e](https://github.com/tiny-open-source/low-code-platform/commit/25a3e9e835c72c5c1ed78b50436f73f57f747a63))



## [1.0.4](https://github.com/tiny-open-source/low-code-platform/compare/v1.0.3...v1.0.4) (2025-01-18)



## [1.0.3](https://github.com/tiny-open-source/low-code-platform/compare/v1.0.2...v1.0.3) (2025-01-18)


### Bug Fixes

* 添加 .nojekyll 文件以修复下划线文件访问问题 ([501b337](https://github.com/tiny-open-source/low-code-platform/commit/501b3379d687743c082e8cc8284a0f254d69f5d1))



## [1.0.2](https://github.com/tiny-open-source/low-code-platform/compare/v1.0.1...v1.0.2) (2025-01-18)


### Features

* no publish ([b76f81f](https://github.com/tiny-open-source/low-code-platform/commit/b76f81f394fa116b34b62a969908a40fc4a597c4))



## [1.0.1](https://github.com/tiny-open-source/low-code-platform/compare/c888b16d25b8c58fedd8c408a4de1c1f00e3be63...v1.0.1) (2025-01-18)


### Bug Fixes

* 当前选中组件处于流式布局模式下时，直接拖动其他组件会错误判断成是流式组件 ([481196d](https://github.com/tiny-open-source/low-code-platform/commit/481196dc3e5d5930d7cb382db4437d06e0c1f67c))
* 修复多选组件时新增组件的体验问题 ([2533eeb](https://github.com/tiny-open-source/low-code-platform/commit/2533eeb101cd904db6b016a0e3c6caaea4a94bbe))
* **core:** 事件触发时组件未初始化，等组件初始化后再调用事件处理 ([ab29121](https://github.com/tiny-open-source/low-code-platform/commit/ab291211c3aae8e7c2d0f99181a4b60c156a161d))
* **designer:** 画布大小与stageRect配置不相符 ([4650f32](https://github.com/tiny-open-source/low-code-platform/commit/4650f32c9387aedda9eda814c5f36909399bb443))
* **designer:** 新增页面时会有一个error ([75e509a](https://github.com/tiny-open-source/low-code-platform/commit/75e509a7d59b41c2f44fcf0e80fd758c658c056e))
* **designer:** 新增组件id不对 ([a7863f5](https://github.com/tiny-open-source/low-code-platform/commit/a7863f5eed71e14aba4e13bf65b93a4d25ceebf2))
* **editor:** 水平居中 ([da71ecf](https://github.com/tiny-open-source/low-code-platform/commit/da71ecfc1ecd101d3b543efc91f35f3f3a0bd86d))
* **editor:** 拖动组件到最右边会多出1px ([ce8f2ad](https://github.com/tiny-open-source/low-code-platform/commit/ce8f2ad444a90b7df587641b9f1f962ecc65d074))
* form label 定宽 ([2049e02](https://github.com/tiny-open-source/low-code-platform/commit/2049e02c728c10f53260d7ba1b8e0c93238417fa))
* **form:** 初始化values时，数组中的对象出现key丢失 ([5f41e81](https://github.com/tiny-open-source/low-code-platform/commit/5f41e8186058d2fb16ba36c02b54883c15e56d38))
* **form:** fieldset checkbox change事件不会触发 ([aabe9de](https://github.com/tiny-open-source/low-code-platform/commit/aabe9de491001fc62e8e539ba5b5718a3bb98666))
* **form:** tabs配置name后出错 ([9c2da82](https://github.com/tiny-open-source/low-code-platform/commit/9c2da829c232d426874ea4b511fc71b1d68454e7))
* path ([8bb1682](https://github.com/tiny-open-source/low-code-platform/commit/8bb16821571404109b313c97e6153019d4b38c56))
* path ([0504daa](https://github.com/tiny-open-source/low-code-platform/commit/0504daa76079911e6a5a6efc73c45b0eb4e13453))
* path ([1c9cd7e](https://github.com/tiny-open-source/low-code-platform/commit/1c9cd7ed86fa749992926f9a7a1284e131cf5c6a))
* path ([a24f98a](https://github.com/tiny-open-source/low-code-platform/commit/a24f98ad50cbd1a147c5b8ab9260de072fd5f4cb))
* path ([852caeb](https://github.com/tiny-open-source/low-code-platform/commit/852caebbb886b06f70b4f5e4c43a05c675da5918))
* prop ([cddca8a](https://github.com/tiny-open-source/low-code-platform/commit/cddca8a37aba74884025d2258890ef21633ea97d))
* **runtime:** lowcodeRuntimeReady时机修改 ([dfe1106](https://github.com/tiny-open-source/low-code-platform/commit/dfe1106e3ae77b5ace6e020128c4506a0e5fc346))
* **stage,runtime:** lowcodeRuntimeReady时机修改 ([85f86b2](https://github.com/tiny-open-source/low-code-platform/commit/85f86b223cb96c32414e5b37c49bfc016283d40b))
* undo redo & icon bug ([2d16632](https://github.com/tiny-open-source/low-code-platform/commit/2d16632ea499b8b93df814260e99f0f0ba7d069c))


### Features

* 编辑器框架搭建 ([2d2ca73](https://github.com/tiny-open-source/low-code-platform/commit/2d2ca7326e63ab7ed8df516745db43fe20418e0e))
* 初步解析表单 ([0f45c4c](https://github.com/tiny-open-source/low-code-platform/commit/0f45c4cb0c5d4d4e5e5ee25a9e8594d9614281ed))
* 初始化代码编辑组件 ([b78ad5a](https://github.com/tiny-open-source/low-code-platform/commit/b78ad5a9e88cb856df01f35d58a2cb77a670cc13))
* 打通runtime和编辑器的基本通信 ([7f02932](https://github.com/tiny-open-source/low-code-platform/commit/7f0293277fc7875ada54093b0d13bd20d9419fde))
* 兼容设备模板 ([1348e25](https://github.com/tiny-open-source/low-code-platform/commit/1348e25e31004e7d7898104d9487859cde34798d))
* 建立子包连结 ([02c2f39](https://github.com/tiny-open-source/low-code-platform/commit/02c2f39fcc49964a5ac0d63f35756c8605246f08))
* 框架区域可调 ([8e3786f](https://github.com/tiny-open-source/low-code-platform/commit/8e3786fe41ef1d3c7f69d799bec55532c7b1d51a))
* 面板可添加组件 ([d8efe7b](https://github.com/tiny-open-source/low-code-platform/commit/d8efe7bff5fbc0bf4f09ef5665d8aa6593a20442))
* 同步mask和runtime滚动状态 ([b750a14](https://github.com/tiny-open-source/low-code-platform/commit/b750a149cd44c2dbfbcbac7a0069b90c1c179036))
* 完善表单联动 ([6216a42](https://github.com/tiny-open-source/low-code-platform/commit/6216a42c86570c825e43a7e8bbc1fbaeb599ba71))
* 完善事件tab ([4aa8adb](https://github.com/tiny-open-source/low-code-platform/commit/4aa8adb0adb9beeff78ab88c1f49969677c32375))
* 完善拖拽事件 ([dbfcb44](https://github.com/tiny-open-source/low-code-platform/commit/dbfcb442fc5e32776270f1b5a22b1f24860318bb))
* 完善form组件 ([668150b](https://github.com/tiny-open-source/low-code-platform/commit/668150b8225ecdc701089d38e96882df3d84e596))
* 完善Stage ([63759cf](https://github.com/tiny-open-source/low-code-platform/commit/63759cf1e954a369c6122eeb68c7bd3cf3d7ecc0))
* 相关样式优化 ([430707e](https://github.com/tiny-open-source/low-code-platform/commit/430707e8a1e9d2991becc05b522178f4ea1a7879))
* 项目框架搭建 ([27dd7de](https://github.com/tiny-open-source/low-code-platform/commit/27dd7de33d767c64da0911ee97a5307b1b55aaa3))
* 预览功能完善 ([c3e44cf](https://github.com/tiny-open-source/low-code-platform/commit/c3e44cfb1bfaedfd4ae30025401eb416dc2808b1))
* 增加stage右键菜单 ([275cffe](https://github.com/tiny-open-source/low-code-platform/commit/275cffe7d78005fc4503171d11d4606d552544ef))
* 支持将组件拖动到指定容器 ([4658f68](https://github.com/tiny-open-source/low-code-platform/commit/4658f6801c18f09d3b8733b0fd31be3bd2522bf6))
* 支持通过按住shift键进行组件多选的能力 ([8df6ae9](https://github.com/tiny-open-source/low-code-platform/commit/8df6ae998369e82c7948247587e3923ba9e467f3))
* 组件库替换为naive-ui ([b201bdb](https://github.com/tiny-open-source/low-code-platform/commit/b201bdb811d4f8450029a718b5fc884ea4e79125))
* add @lowcode/form ([c7151a4](https://github.com/tiny-open-source/low-code-platform/commit/c7151a4390722f78ea43e2a5527aab8d21ac2c75))
* add env config file ([e7fe6e6](https://github.com/tiny-open-source/low-code-platform/commit/e7fe6e6159de0d9af7644340fbc8c821c50ea2c8))
* add form component ([13315df](https://github.com/tiny-open-source/low-code-platform/commit/13315df9930292b8ffbf8c2abfc05b480037e230))
* add layer panel ([3a37324](https://github.com/tiny-open-source/low-code-platform/commit/3a3732401196e22bae16e58964c417ddb7112a34))
* add lowcode schema ([9be995e](https://github.com/tiny-open-source/low-code-platform/commit/9be995e5ebb567a56f27d0834103e57e13c87237))
* add menu ([30b7988](https://github.com/tiny-open-source/low-code-platform/commit/30b79883bcf965c3058cd259fe3436e50aaa3f6f))
* add monaco editor ([fbbc72e](https://github.com/tiny-open-source/low-code-platform/commit/fbbc72ec6c1e0ee606ade00bbb2de57ac45bf459))
* add playground deploy workflow ([9e72b30](https://github.com/tiny-open-source/low-code-platform/commit/9e72b304b51cd951b4a30a46415a8c04ae0a2af3))
* add ruler ([2fe2ba9](https://github.com/tiny-open-source/low-code-platform/commit/2fe2ba91637493ea55ae18c1ad61f95fc3fd826f))
* add runtime button component ([15c06b4](https://github.com/tiny-open-source/low-code-platform/commit/15c06b4be1964125bb7862f622ee1725eaa2ae3a))
* add runtime core ([9bf21b8](https://github.com/tiny-open-source/low-code-platform/commit/9bf21b81bca5682fa1f1287b7ce3ae13da72a207))
* add shortcut key ([2632e41](https://github.com/tiny-open-source/low-code-platform/commit/2632e41d65c71164ea7a635788f1314d5a35f67f))
* add ui select mode ([e42985e](https://github.com/tiny-open-source/low-code-platform/commit/e42985e818de632eef606470df04a2938604ed79))
* base framework ([5050777](https://github.com/tiny-open-source/low-code-platform/commit/5050777e5ba59a2f4c969bdd9dca2d18c2c1fc47))
* component-panel 基本样式 ([327aac9](https://github.com/tiny-open-source/low-code-platform/commit/327aac91bea5e95f0dee7f92afa9485d6917414c))
* **designer:** 添加props-panel-header slot;修改layer-panel,component-list-panel slot名称，加上-header ([da087a5](https://github.com/tiny-open-source/low-code-platform/commit/da087a5ba31bd0e4b162a4b86fcd930bc1021a2e))
* **designer:** editorService.add 的addNode参数对象中加上inputEvent ([4e0f4f2](https://github.com/tiny-open-source/low-code-platform/commit/4e0f4f22802cd81c0ee02a5ef306ab95583263eb))
* **editor:** 添加layer-panel/component-list-panel slot ([59da4bb](https://github.com/tiny-open-source/low-code-platform/commit/59da4bb4e4fda692eb8a5c443abf241df0452f46))
* event trigger and form prop size ([ef39cb2](https://github.com/tiny-open-source/low-code-platform/commit/ef39cb26c67785b834e1e347c4d91b4641dc72b1))
* init ([a579911](https://github.com/tiny-open-source/low-code-platform/commit/a579911aeacc816f3d4cf15d6358a40665168f08))
* init ([38ae04b](https://github.com/tiny-open-source/low-code-platform/commit/38ae04b5e98b24d6991e5882923a54a531d368a6))
* init template ([c888b16](https://github.com/tiny-open-source/low-code-platform/commit/c888b16d25b8c58fedd8c408a4de1c1f00e3be63))
* mask 初始化 ([15ef9a7](https://github.com/tiny-open-source/low-code-platform/commit/15ef9a7bc7d88f7288ef71cdca7a78f0c5a5a03a))
* runtime ui组件搭建 ([e3d0ab9](https://github.com/tiny-open-source/low-code-platform/commit/e3d0ab9c114cf29ec8b856b8aef3fcf7a5044288))
* runtime热更 ([15e84ea](https://github.com/tiny-open-source/low-code-platform/commit/15e84ea6a4c0627eda46c3953c9363cda93c9e1b))
* show source code & device group ([17b862b](https://github.com/tiny-open-source/low-code-platform/commit/17b862bfcfb753d09faedfbc40163c96488b0d87))
* stage 宽高计算 ([19e3c82](https://github.com/tiny-open-source/low-code-platform/commit/19e3c823a948534ab54e053e30d52dd70f7f1801))
* **stage:** 1) 高亮边框样式加粗 ([24d5afe](https://github.com/tiny-open-source/low-code-platform/commit/24d5afea7b725f5ac9db8078171e45318924b871))
* tmagic ([8fb0583](https://github.com/tiny-open-source/low-code-platform/commit/8fb058343f1eefbe729b67cd0b17f508d7b2dc4d))
* update deps ([2ef5789](https://github.com/tiny-open-source/low-code-platform/commit/2ef5789df735489a3b43e15a872342ab7fa361c6))



