// vscode这个包，包含了里面所有的api
import * as vscode from 'vscode';
import * as GenerateH5 from './h5-ts/generate';
// 在插件被激活的时候，这个方法会被调用
function activate(context) {
  vscode.commands.registerCommand('Generate.component.h5.ts', GenerateH5.generate);

  //需要释放的资源都在这里依次push到这个数组里面
  // context.subscriptions.push(counter);
}
exports.activate = activate;

// this method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
function deactivate() {}
exports.deactivate = deactivate;
