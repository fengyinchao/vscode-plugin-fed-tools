// vscode这个包，包含了里面所有的api
import * as vscode from 'vscode';
// 在插件被激活的时候，这个方法会被调用
function activate(context) {
  console.log('hello world');
  //需要释放的资源都在这里依次push到这个数组里面
  // context.subscriptions.push(counter);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
