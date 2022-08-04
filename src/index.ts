import * as vscode from 'vscode';
import { LeftWebviewViewProvider } from './gen-project/LeftWebviewViewProvider';
import { FedStandardConfigRightPanel } from './gen-project/FedStandardConfigRightPanel';
import * as GenerateH5 from './h5-ts/generate';

// 在插件被激活的时候，这个方法会被调用
function activate(context) {
  vscode.commands.registerCommand('Generate.component.h5.ts', GenerateH5.generate);

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
exports.activate = activate;

// this method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
function deactivate() {}
exports.deactivate = deactivate;
