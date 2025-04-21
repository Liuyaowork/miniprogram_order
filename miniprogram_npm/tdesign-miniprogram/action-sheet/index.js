// 从 show 模块中导入 show、close 方法和 ActionSheetTheme 枚举
import { show, close, ActionSheetTheme } from './show';

// 导出 ActionSheetTheme 枚举，供外部使用
export { ActionSheetTheme };

// 默认导出一个包含 show 和 close 方法的对象
export default {
    // 显示操作面板
    show(options) {
        return show(options); // 调用 show 方法并传入选项
    },
    // 关闭操作面板
    close(options) {
        return close(options); // 调用 close 方法并传入选项
    },
};
