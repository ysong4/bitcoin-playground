import { Button, Form, Input } from 'antd';
import { layout, tailLayout } from '../common/formLayout';

const GenerateSeed: React.VFC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Generate Form:', values);

    // form.setFieldsValue({ address: addressBech32 });
  };

  return (
    <>
      <Form {...layout} form={form} onFinish={onFinish}>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Generate
          </Button>
        </Form.Item>
        <Form.Item
          name="mnemonic"
          label="Mnemonic"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="seed"
          label="Seed"
        >
          <Input />
        </Form.Item>
      </Form>
    </>
  );
};

export default GenerateSeed;
