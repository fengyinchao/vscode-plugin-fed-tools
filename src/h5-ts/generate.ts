import * as vscode from 'vscode';

export function generate() {
  const workspaceUri = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0].uri;
  const currentUri = workspaceUri;
  if (!currentUri) {
    vscode.window.showErrorMessage("Workspace doesn't contain any folders.");
    return;
  }
  // node file generate ...
}
