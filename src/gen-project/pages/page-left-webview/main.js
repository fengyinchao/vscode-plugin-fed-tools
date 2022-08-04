/* eslint-disable wrap-iife */
(function () {
  // eslint-disable-next-line no-undef
  const vscode = acquireVsCodeApi();
  // Handle messages sent from the extension to the webview
  window.addEventListener('message', (event) => {
    const message = event.data; // The json data that the extension sent
    switch (message.type) {
      case 'addColor': {
        // addColor();
        break;
      }
    }
  });
  // eslint-disable-next-line no-undef
  const { Button } = tiny;

  const App = () => (
    <div>
      <Button
        size="sm"
        btnType="primary"
        onClick={() => {
          vscode.postMessage({ type: 'create-standard-config-page' });
        }}
      >
        FED代码规范接入
      </Button>
      {/* <Button size="sm" btnType="primary" onClick={() => {
          vscode.postMessage({ type: "create-rn-pendant" });
        }}>创建 RN 挂件项目</Button> */}
    </div>
  );
  // eslint-disable-next-line no-undef
  ReactDOM.render(<App></App>, document.getElementById('root'));
})();
