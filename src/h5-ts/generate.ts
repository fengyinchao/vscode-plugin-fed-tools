import * as vscode from 'vscode';
import fs from 'fs';
import path from 'path';

export function generate() {
  // from uri to get url,node's fs need the type of url
  const workspaceUri = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0].uri;
  const workspaceUrl = workspaceUri.fsPath;

  if (!workspaceUrl) {
    vscode.window.showErrorMessage("Workspace doesn't contain any folders.");
    return;
  }

  vscode.window
    .showInputBox({
      placeHolder: '请输入文件夹名称（ex：aaBB、aa-bb）',
    })
    .then(folderName => {
      const folderNames = folderName.split('-');
      const isValidFolder = folderNames.every(n => /^[a-zA-Z]([a-zA-Zd])*/g.test(n));

      if (!isValidFolder) {
        vscode.window.showErrorMessage('请输入正确格式文件名');

        return;
      }
      const camelFolderName = folderNames.map(n => (!!n ? n[0].toUpperCase() + n.substring(1, n.length) : '')).join('');

      fs.mkdir(path.resolve(workspaceUrl, folderName), err => {
        if (err) {
          vscode.window.showErrorMessage(err.message);

          return;
        }
        const fileDirPath = path.resolve(`${workspaceUrl}/${folderName}`);

        // 新建静态资源文件夹
        fs.mkdir(path.resolve(fileDirPath, 'assets'), dirError => {
          if (dirError) {
            vscode.window.showErrorMessage(dirError.message);
          }
        });

        // 新建css文件
        fs.writeFile(path.resolve(fileDirPath, 'index.css'), '', cssFileError => {
          if (cssFileError) {
            vscode.window.showErrorMessage(cssFileError.message);

            return;
          }

          // 新增组件文件
          fs.writeFile(path.resolve(fileDirPath, `${camelFolderName}.ts`), 'import "./index.css"', fileError => {
            if (fileError) {
              vscode.window.showErrorMessage(fileError.message);

              return;
            }

            // 新增导出文件
            fs.writeFile(
              path.resolve(fileDirPath, 'index.ts'),
              `import ${camelFolderName} from "./${camelFolderName}.ts";\n\nexport default ${camelFolderName};\n`,
              fileError => {
                if (fileError) {
                  vscode.window.showErrorMessage(fileError.message);

                  return;
                }

                vscode.window.showInformationMessage('Success');
              },
            );
          });
        });
      });
    });
}
