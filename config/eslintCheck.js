/* eslint-disable prefer-template */
/**
 * 工程代码pre-commit 检查工具
 * @date 2019.9.4
 * @description 使用 ESLint 对即将提交的代码进行检查，阻止不符合规范的代码提交
 * @author 310227663@qq.com
 */
const { exec } = require('child_process');
const chalk = require('chalk');
const { CLIEngine } = require('eslint');
const cli = new CLIEngine({});
const { log } = console;

/**
 * 根据错误级别数字返回对应的错误类型
 * @param {number} number 错误级别 (1: 警告, 2: 错误)
 * @returns {string} 错误类型 ('warn', 'error', 'undefined')
 */
function getErrorLevel(number) {
  switch (number) {
    case 2:
      return 'error';
    case 1:
      return 'warn';
    default:
  }
  return 'undefined';
}

let pass = 0; // 标记是否通过检查

// 获取暂存区中修改的 .js 和 .ts 文件，并使用 ESLint 检查
exec(
  'git diff --cached --name-only --diff-filter=ACM | grep -Ei "\\.ts$|\\.js$"',
  (error, stdout) => {
    if (stdout.length) {
      const array = stdout.split('\n');
      array.pop(); // 移除最后一个空元素
      const { results } = cli.executeOnFiles(array); // 执行 ESLint 检查
      let errorCount = 0;
      let warningCount = 0;

      results.forEach((result) => {
        errorCount += result.errorCount;
        warningCount += result.warningCount;

        if (result.messages.length > 0) {
          log('\n');
          log(result.filePath); // 输出文件路径

          result.messages.forEach((obj) => {
            const level = getErrorLevel(obj.severity); // 获取错误级别
            if (level === 'warn')
              log(
                ' ' +
                obj.line +
                ':' +
                obj.column +
                '\t ' +
                chalk.yellow(level) +
                ' \0  ' +
                obj.message +
                '\t\t' +
                chalk.grey(obj.ruleId) +
                '',
              );
            if (level === 'error')
              log(
                ' ' +
                obj.line +
                ':' +
                obj.column +
                '\t ' +
                chalk.red.bold(level) +
                ' \0  ' +
                obj.message +
                '\t\t ' +
                chalk.grey(obj.ruleId) +
                '',
              );
            if (level === 'error') pass = 1; // 如果有错误，标记为未通过
          });
        }
      });

      if (warningCount > 0 || errorCount > 0) {
        // 输出总问题数
        log(
          '\n' +
          chalk.bgRed.bold(errorCount + warningCount + ' problems') +
          ' (' +
          chalk.red.bold(errorCount) +
          ' errors, ' +
          chalk.yellow(warningCount) +
          ' warnings) \0',
        );
      }

      // 如果没有错误，输出成功信息
      !pass && log(chalk.green.bold('~~ Done: 代码检验通过，提交成功 ~~'));
      process.exit(pass); // 根据 pass 值退出进程
    }

    if (error !== null) {
      log(`exec error: ${error}`); // 输出执行错误信息
    }
  },
);
