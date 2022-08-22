/*
 * @description: 主入口
 * @author: Feng Yinchao
 * @Date: 2022-08-02 10:17:42
 */

import * as vscode from 'vscode';
import LeftWebviewViewProvider from './gen-project/LeftWebviewViewProvider';
import { FedStandardConfigRightPanel } from './gen-project/FedStandardConfigRightPanel';
import generateH5 from './h5-ts/generate';

// 在插件被激活的时候，这个方法会被调用
function activate(context) {
  vscode.commands.registerCommand('Generate.component.h5.ts', generateH5);

  // WebviewViewProvider 部分
  const provider = new LeftWebviewViewProvider(context.extensionUri);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider(LeftWebviewViewProvider.viewType, provider));

  // WebViewPanel 部分
  context.subscriptions.push(
    vscode.commands.registerCommand('fed-tools.showFedStandardConfigPanel', () => {
      FedStandardConfigRightPanel.createOrShow(context.extensionUri);
    }),
  );
}
module.exports.activate = activate;

// this method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
function deactivate() {}
module.exports.deactivate = deactivate;
