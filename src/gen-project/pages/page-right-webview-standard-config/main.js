/*
 * @description:
 * @author: Feng Yinchao
 * @Date: 2022-08-04 12:46:14
 */
/* eslint-disable no-undef */
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
      default:
        break;
    }
  });
  // eslint-disable-next-line no-undef, object-curly-newline
  const { Button, Form, Radio } = tiny;

  const Wrapper = () => (
    <div style={{ backgroundColor: '#fff', width: '100%', height: '100%' }}>
      <Form
        onFinish={(values) => {
          vscode.postMessage({ type: 'generate-fed-standard-config', data: values });
        }}
        onFinishFailed={({ values, errors }) => console.log(values, errors)}
        style={{ maxWidth: 800 }}
      >
        <Form.Item label="项目类型" name="type" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="React">React</Radio>
            <Radio value="RN">ReactNative</Radio>
            <Radio value="Node">Node</Radio>
            <Radio value="Vue">Vue</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="项目语言" name="language" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="JS">JS</Radio>
            <Radio value="TS">TS</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Button block btnType="primary" type="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  // eslint-disable-next-line no-undef
  ReactDOM.render(<Wrapper></Wrapper>, document.getElementById('root'));
})();
