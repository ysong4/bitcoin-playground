import { Button, Form, Input } from 'antd';
import { layout, tailLayout } from '../common/formLayout';
import * as bip39 from 'bip39';

const GenerateSeed: React.VFC = () => {
  const [form] = Form.useForm();

  const onFinish = () => {
    // Generate a random mnemonic (uses crypto.randomBytes under the hood), defaults to 128-bits of entropy
    const mnemonic = bip39.generateMnemonic();

    const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
    
    form.setFieldsValue({ mnemonic: mnemonic, seed: seed });
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
          <Input placeholder="generated mnemoic, for output only"/>
        </Form.Item>
        <Form.Item
          name="seed"
          label="Seed"
        >
          <Input placeholder="generated seed in hex format, for output only" />
        </Form.Item>
      </Form>
    </>
  );
};

export default GenerateSeed;
