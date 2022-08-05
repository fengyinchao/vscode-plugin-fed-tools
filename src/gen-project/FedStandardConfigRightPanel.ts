/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-case-declarations */
/* eslint-disable no-underscore-dangle */
/*
 * @description:
 * @author: Feng Yinchao
 * @Date: 2022-08-04 12:46:14
 */
// eslint-disable-next-line import/no-unresolved
import * as vscode from 'vscode';
import path from 'path';
import fs from 'fs';

import getNonce from './getNonce';

export function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
  return {
    // Enable javascript in the webview
    enableScripts: true,

    // And restrict the webview to only loading content from our extension's `media` directory.
    localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist/src/gen-project/pages')],
  };
}

export class FedStandardConfigRightPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  static currentPanel: FedStandardConfigRightPanel | undefined;

  static readonly viewType = 'ProjectType';

  private readonly _panel: vscode.WebviewPanel;

  private readonly _extensionUri: vscode.Uri;

  private _disposables: vscode.Disposable[] = [];

  workspaceUrl: vscode.Uri;

  static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

    // If we already have a panel, show it.
    if (FedStandardConfigRightPanel.currentPanel) {
      // eslint-disable-next-line no-underscore-dangle
      FedStandardConfigRightPanel.currentPanel._panel.reveal(column);
      return;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      FedStandardConfigRightPanel.viewType,
      'FED代码规范接入',
      column || vscode.ViewColumn.One,
      getWebviewOptions(extensionUri),
    );

    FedStandardConfigRightPanel.currentPanel = new FedStandardConfigRightPanel(panel, extensionUri);
  }

  static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    FedStandardConfigRightPanel.currentPanel = new FedStandardConfigRightPanel(panel, extensionUri);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    this._panel.webview.html = this._getHtmlForWebview(this._panel.webview);
    // from uri to get url,node's fs need the type of url
    const workspaceUri = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0].uri;
    const workspaceUrl = workspaceUri.fsPath;
    this.workspaceUrl = workspaceUri;

    if (!workspaceUrl) {
      vscode.window.showErrorMessage("Workspace doesn't contain any folders.");
      return;
    }

    const targetTemplatePath = path.resolve(workspaceUrl, 'node_modules', '@shark/eslint-config-fed');

    if (!targetTemplatePath) {
      vscode.window.showErrorMessage('未找到 @shark/eslint-config-fed 包，请安装该包');
      return;
    }

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programmatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      (message) => {
        console.log('===receive message', message);

        switch (message.type) {
          case 'generate-fed-standard-config':
            let outProgress = null;
            let outResolve = null;
            vscode.window.withProgress(
              {
                location: vscode.ProgressLocation.Notification,
                title: '正在接入FED标准',
                cancellable: true,
              },
              (progress, token) => {
                token.onCancellationRequested(() => {
                  console.log('你取消了接入过程');
                });
                outProgress = progress;

                progress.report({ increment: 0 });

                const p = new Promise<void>((resolve) => {
                  outResolve = resolve;
                });

                return p;
              },
            );
            // 1、copy 文件到宿主项目
            [
              '.editorconfig',
              '.eslintignore',
              '.gitignore',
              '.prettierrc.js',
              '.prettierignore',
              'commitlint.config.js',
            ].forEach((file) => {
              fs.copyFile(path.resolve(targetTemplatePath, file), path.resolve(workspaceUrl, file), (err) => {
                if (err) {
                  vscode.window.showErrorMessage(err.toString());
                  return;
                }
                setTimeout(() => {
                  outProgress.report({ increment: 30, message: '复制文件中...' });
                }, 2000);
              });
            });
            // 2、创建 .eslintrc.js
            const { data } = message;
            const contentTemplate = `module.exports = {
  extends: [
    ${
      data.language === 'JS'
        ? '"@shark/eslint-config-fed/javascript-base"'
        : '"@shark/eslint-config-fed/typescript-base"'
    },
    ${data.type === 'React' ? '"@shark/eslint-config-fed/react",' : ''}
    ${data.type === 'RN' ? '"@shark/eslint-config-fed/rn",' : ''}
    ${data.type === 'Vue' ? '"@shark/eslint-config-fed/vue",' : ''}
    ${data.type === 'Node' ? '"@shark/eslint-config-fed/node",' : ''}
  ],
};`;
            fs.writeFile(path.resolve(workspaceUrl, '.eslintrc.js'), contentTemplate, 'utf8', (err) => {
              if (err) {
                vscode.window.showErrorMessage(err.toString());
                return;
              }
              setTimeout(() => {
                outProgress.report({ increment: 60, message: '.eslintrc.js 创建成功' });
              }, 4000);
            });
            // 3、修改 package.json
            const packageJsonPath = path.resolve(workspaceUrl, 'package.json');
            console.log('===packageJsonPath', packageJsonPath);

            const packageJson = { ...require(packageJsonPath) };

            const targetTemplatePackageJsonPath = path.resolve(targetTemplatePath, 'package.json');
            console.log('===targetTemplatePackageJsonPath', targetTemplatePackageJsonPath);
            const targetPackageJson = require(targetTemplatePackageJsonPath);
            try {
              packageJson.husky = targetPackageJson.husky;
              packageJson['lint-staged'] = targetPackageJson['lint-staged'];
              const deps = targetPackageJson.dependencies;
              // 移除 packageJson 中同名依赖
              Object.keys(deps).forEach((dep) => {
                if (packageJson.devDependencies[dep]) {
                  delete packageJson.devDependencies[dep];
                }
              });
              // 如果不是 TS 项目，移除对应依赖
              if (data.language === 'JS') {
                delete deps.typescript;
                delete deps['@typescript-eslint/eslint-plugin'];
                delete deps['@typescript-eslint/parser'];
              }
              // 如果不是对应项目类型，移除对应依赖
              if (data.type !== 'RN') {
                delete deps['eslint-plugin-react-native'];
              }
              if (data.type !== 'Vue') {
                delete deps['eslint-plugin-vue'];
              }
              if (data.type !== 'Node') {
                delete deps['eslint-plugin-node'];
              }
              if (data.type !== 'React') {
                delete deps['eslint-plugin-react'];
                delete deps['eslint-plugin-react-hooks'];
              }
              packageJson.devDependencies = {
                ...packageJson.devDependencies,
                ...deps,
              };

              console.log('===最终的 packageJson', packageJson);

              fs.writeFile(
                path.resolve(workspaceUrl, 'package.json'),
                JSON.stringify(packageJson, null, 2),
                'utf8',
                (err) => {
                  if (err) {
                    vscode.window.showErrorMessage(err.toString());
                    return;
                  }
                  setTimeout(() => {
                    outProgress.report({ increment: 90, message: 'package.json 修改成功' });
                  }, 6000);
                  setTimeout(() => {
                    outResolve();
                    vscode.window.showInformationMessage('接入成功,请重新安装依赖 yarn install');
                  }, 8000);
                },
              );
            } catch (error) {
              console.log('===error', error);
            }

            break;

          default:
        }
      },
      null,
      this._disposables,
    );
  }

  dispose() {
    FedStandardConfigRightPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const scriptUriReact = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist/src/gen-project/pages/lib', 'react.js'),
    );
    const scriptUriReactDom = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist/src/gen-project/pages/lib', 'react-dom.js'),
    );
    const scriptUriBabel = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist/src/gen-project/pages/lib', 'babel-standalone.js'),
    );
    const scriptUriTinyUI = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist/src/gen-project/pages/lib', 'tiny-ui.js'),
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist/src/gen-project/pages/lib', 'tiny-ui.css'),
    );

    // 自己的业务代码入口
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        'dist/src/gen-project/pages/page-right-webview-standard-config',
        'main.js',
      ),
    );

    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en" style="width:100%;height:100%">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleMainUri}" rel="stylesheet">
        <script  src="${scriptUriBabel}"></script>
        <script nonce="${nonce}" src="${scriptUriReact}"></script>
        <script nonce="${nonce}" src="${scriptUriReactDom}"></script>
        <script nonce="${nonce}" src="${scriptUriTinyUI}"></script>
			</head>
			<body  style="width:100%;height:100%">
      <div id="root" style="width:100%;height: 100%"></div>
      <script type="text/babel" nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}
