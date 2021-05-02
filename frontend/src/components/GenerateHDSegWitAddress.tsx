import { Button, Col, Form, Input, Row, Typography } from 'antd';
// import HDKey from 'hdkey';
import { bech32 } from 'bech32';
import styled from 'styled-components';
import { hash160, isHex } from '../utils/common';
import { layout, tailLayout } from '../common/formLayout';
import crypto from 'crypto';
import secp256k1 from 'secp256k1';

const { Title } = Typography;

const HARDENED_OFFSET = 0x80000000;
const MASTER_SECRET = Buffer.from('Bitcoin seed', 'utf8');

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
        if (val !== 'm') {
          throw Error('Path should start with m or M');
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
    // // Use hdkey library to generate, for verify my result
    // const hdKey = HDKey.fromMasterSeed(Buffer.from(values.seed, 'hex'));
    // const childKey = hdKey.derive(values.path);

    const seedBuffer = Buffer.from(values.seed, 'hex');

    let privateKey = Buffer.from([]);
    let publicKey = Buffer.from([]);
    let chainCode = Buffer.from([]);

    // Generate private key and public key
    const arr = values.path.toLowerCase().split('/');
    arr.forEach((val, index) => {
      // Check the head element

      if (index === 0) {
        const output = crypto
          .createHmac('sha512', MASTER_SECRET)
          .update(seedBuffer)
          .digest();
        privateKey = output.slice(0, 32);
        chainCode = output.slice(32);
        publicKey = Buffer.from(secp256k1.publicKeyCreate(privateKey, true));
        return;
      }

      // Check the following childIndex

      let childIndex = parseInt(val, 10);
      let hardened = false;
      if (val.length > 0 && val[val.length - 1] === "'") {
        // hardened child index
        childIndex += HARDENED_OFFSET;
        hardened = true;
      }

      // normal index: [0, 2**31)
      // hardened index: [2**31, 2**32)
      const childIndexBuffer = Buffer.allocUnsafe(4);
      childIndexBuffer.writeUInt32BE(childIndex, 0);

      let data: Buffer;
      if (hardened) {
        // 0x00 + privateKey + index
        data = Buffer.concat([Buffer.alloc(1, 0), privateKey, childIndexBuffer]);
      } else {
        // publicKey + index
        data = Buffer.concat([publicKey, childIndexBuffer]);
      }

      const output = crypto
        .createHmac('sha512', chainCode)
        .update(data)
        .digest();
      const outputL = output.slice(0, 32);
      privateKey = Buffer.from(
        secp256k1.privateKeyTweakAdd(Buffer.from(privateKey), outputL),
      );
      chainCode = output.slice(32);
      publicKey = Buffer.from(secp256k1.publicKeyCreate(privateKey, true));
    });
      
    // console.log('hdkey:', childKey.privateKey.toString('hex'));
    // console.log('self: ', privateKey.toString('hex'));

    // hash160
    const publicKeyHash = hash160(publicKey);

    // Native SegWit address, bech32 format, start with 'bc1'
    const words = bech32.toWords(publicKeyHash);
    words.unshift(0); // Add witness version, 0
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
          <Input placeholder="a 64 bytes hex string" />
        </Form.Item>
        <Form.Item
          name="path"
          label="HD Path"
          rules={[{ required: true, validator: validatePath }]}
        >
          <Input placeholder="e.g. m/44'/0'/0'/0/0" />
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
          <Input placeholder="for output only" />
        </Form.Item>
      </Form>
    </>
  );
};

export default GenerateHDSegWitAddress;

const StyledRow = styled(Row)`
  margin-bottom: 10px;
`;
