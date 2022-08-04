/* eslint-disable no-console */
/*
 * @Description:
 * @Author: Feng Yinchao
 * @Date: 2022-02-11 15:33:45
 */
import * as vscode from 'vscode';
import getNonce from './getNonce';

export class FedStandardConfigRightPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  static currentPanel: FedStandardConfigRightPanel | undefined;

  static readonly viewType = 'ProjectType';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

    // If we already have a panel, show it.
    if (FedStandardConfigRightPanel.currentPanel) {
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

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programmatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      (message) => {
        console.log('===fs', message);

        switch (message.type) {
          case 'generate-project':
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const fs = require('fs');
            console.log('===fs', fs);
            return;
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

export function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
  return {
    // Enable javascript in the webview
    enableScripts: true,

    // And restrict the webview to only loading content from our extension's `media` directory.
    localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist/src/gen-project/pages')],
  };
}
