import { Button, Col, Form, Input, Row, Typography } from 'antd';
import HDKey from 'hdkey';
import crypto from 'crypto';
import { bech32 } from 'bech32';
import styled from 'styled-components';
import isHex from '../utils/common';
import { layout, tailLayout } from '../common/formLayout';

const { Title } = Typography;

const HARDENED_OFFSET = 0x80000000;

type FormValues = {
  seed: string;
  path: string;
};

const GenerateHDSegWitAddress: React.VFC = () => {
  const [form] = Form.useForm();

  const validateSeed = async (_: any, seed: string) => {
    // Check if hex
    if (!isHex(seed)) {
      throw Error('Not in hex format');
    }
    // Check length
    if (seed.length !== 128) {
      throw Error('Not a 64 bytes hex string');
    }
  };

  const validatePath = async (_: any, path: string) => {
    const arr = path.toLowerCase().split('/');
    arr.forEach((val, index) => {
      // Check the head element
      if (index === 0) {
        if (val !== 'm' && val !== "m'") {
          throw Error("Path should start with m or m'");
        }
        return;
      }

      // Check the following childIndex
      if (val.length > 0 && val[val.length - 1] === "'") {
        val = val.slice(0, -1);
      }
      const childIndex = parseInt(val, 10);
      if (isNaN(+val)) {
        throw Error('ChildIndex is not a number');
      }
      if (Number(val) !== childIndex) {
        throw Error('ChildIndex is not an integer');
      }
      if (childIndex >= HARDENED_OFFSET || childIndex < 0) {
        throw Error(`ChildIndex should be in range [0, ${HARDENED_OFFSET})`);
      }
    });
  };

  const onFinish = (values: FormValues) => {
    console.log('Generate HD SegWit Address:', values);

    const hdKey = HDKey.fromMasterSeed(Buffer.from(values.seed, 'hex'));
    const childKey = hdKey.derive(values.path);

    // hash160
    const sha = crypto.createHash('sha256').update(childKey.publicKey).digest();
    const publicKeyHash = crypto.createHash('ripemd160').update(sha).digest();

    // Native SegWit address, bech32 format, start with 'bc1'
    const words = bech32.toWords(publicKeyHash);
    words.unshift(0);
    const addressBech32 = bech32.encode('bc', words);

    form.setFieldsValue({ address: addressBech32 });
  };

  return (
    <>
      <StyledRow>
        <Col offset={4} span={16}>
          <Title level={4}>Input:</Title>
        </Col>
      </StyledRow>
      <Form {...layout} onFinish={onFinish}>
        <Form.Item
          name="seed"
          label="Seed"
          rules={[{ required: true, validator: validateSeed }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="path"
          label="HD Path"
          rules={[{ required: true, validator: validatePath }]}
        >
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Generate
          </Button>
        </Form.Item>
      </Form>
      <StyledRow>
        <Col offset={4} span={16}>
          <Title level={4}>Output:</Title>
        </Col>
      </StyledRow>
      <Form {...layout} form={form}>
        <Form.Item name="address" label="Generated Address">
          <Input placeholder="Don't input anything here, it is for output" />
        </Form.Item>
      </Form>
    </>
  );
};

export default GenerateHDSegWitAddress;

const StyledRow = styled(Row)`
  margin-bottom: 10px;
`;
