/* eslint-disable no-console */
/* eslint-disable wrap-iife */
(function () {
  // eslint-disable-next-line no-undef
  const vscode = acquireVsCodeApi();

  // Handle messages sent from the extension to the webview
  window.addEventListener('message', (event) => {
    const message = event.data; // The json data that the extension sent
    switch (message.type) {
      case 'addColor': {
        break;
      }
    }
  });
  // eslint-disable-next-line no-undef, object-curly-newline
  const { Button, Form, Input, Alert } = tiny;

  const Wrapper = () => {
    // eslint-disable-next-line no-undef
    const [visible, setVisible] = React.useState(false);
    const onClick = () => {
      vscode.postMessage({ type: 'generate-project' });
      setVisible(true);
    };
    return (
      <div style={{ backgroundColor: '#fff', width: '100%', height: '100%' }}>
        {visible && <Alert closeText="知道了">敬请期待</Alert>}
        <Form
          onFinish={(values) => console.log(values)}
          onFinishFailed={({ values, errors }) => console.log(values, errors)}
          style={{ maxWidth: 500 }}
        >
          <Form.Item label="项目名称" name="number" rules={[{ max: 10 }]}>
            <Input placeholder="输入项目名称，如 dyrnchannel" />
          </Form.Item>
          <Form.Item>
            <Button size="sm" btnType="primary" onClick={onClick}>
              创建 RN 页面项目
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  // eslint-disable-next-line no-undef
  ReactDOM.render(<Wrapper></Wrapper>, document.getElementById('root'));
})();
