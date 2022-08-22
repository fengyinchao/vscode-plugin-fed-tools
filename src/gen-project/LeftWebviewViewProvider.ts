/*
 * @description: LeftWebviewViewProvider 左侧 webview 容器
 * @author: Feng Yinchao
 * @Date: 2022-02-11 13:51:09
 */
import * as vscode from 'vscode';
import getNonce from './getNonce';
import { FedStandardConfigRightPanel } from './FedStandardConfigRightPanel';

export class LeftWebviewViewProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'douyu-fed-codegen';

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case 'create-standard-config-page': {
          FedStandardConfigRightPanel.createOrShow(this._extensionUri);
          break;
        }
      }
    });
  }

  addColor() {
    if (this._view) {
      this._view.show?.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
      this._view.webview.postMessage({ type: 'addColor' });
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
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist/src/gen-project/pages/lib', 'vscode.css'),
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist/src/gen-project/pages/lib', 'tiny-ui.css'),
    );

    // 自己的业务代码入口
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist/src/gen-project/pages/page-left-webview', 'main.js'),
    );

    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">
        <script  src="${scriptUriBabel}"></script>
        <script nonce="${nonce}" src="${scriptUriReact}"></script>
        <script nonce="${nonce}" src="${scriptUriReactDom}"></script>
        <script nonce="${nonce}" src="${scriptUriTinyUI}"></script>
			</head>
			<body>
      <div id="root"></div>
      <script type="text/babel" nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}
