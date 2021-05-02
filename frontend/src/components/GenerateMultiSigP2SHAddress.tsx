import { Button, Col, Form, Input, InputNumber, Row, Typography } from 'antd';
import styled from 'styled-components';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
// import * as bitcoin from 'bitcoinjs-lib';
import { base58checkEncode, hash160, isHex } from '../utils/common';
import { layout, tailLayout } from '../common/formLayout';

const { Title } = Typography;

const OP_INT_BASE = 80;
const OP_CHECKMULTISIG = 174;
const MAINNET_PREFIX = 0x05;

const PUBLIC_KEY_LENGTH = 33;

type FormValues = {
  m: number; // number of pubkeys
  n: number; // number of sig
  publicKeys: string[];
};

const GenerateMultiSigP2SHAddress: React.VFC = () => {
  const [inputForm] = Form.useForm();
  const [outputForm] = Form.useForm();

  const validateM = async (_: any, m: number) => {
    const publicKeys = inputForm.getFieldValue('publicKeys');
    if (Array.isArray(publicKeys) && publicKeys.length !== m) {
      throw Error('m should equal to number of public keys');
    }
  };

  const validateN = async (_: any, n: number) => {
    const m = inputForm.getFieldValue('m') as number;
    if (n > m) {
      throw Error('n should be <= m');
    }
  };

  const validatePublicKey = async (_: any, publicKey: string) => {
    if (!isHex(publicKey)) {
      throw Error('public key should be in hex format');
    }
  };

  const onFinish = (values: FormValues) => {
    console.log('Generate n-out-of-m MultiSignature P2SH Address:', values);

    const pubKeys = values.publicKeys.map((hex: string) =>
      Buffer.from(hex, 'hex'),
    );

    // // bitcoinjs-lib, to verify my result
    // const redeem = bitcoin.payments.p2ms({ m: values.n, pubkeys: pubKeys });
    // const { address } = bitcoin.payments.p2sh({
    //   redeem: redeem,
    // });
    // console.log('bitcoinjs-lib redeem', redeem.output?.toString('hex'));
    // console.log('bitcoinjs-lib address', address);

    // P2MS 
    const op_n = Buffer.from([OP_INT_BASE + Number(values.n)]);
    const op_m = Buffer.from([OP_INT_BASE + Number(values.m)]);
    
    let pubKeysBuffer = Buffer.from([]);
    pubKeys.forEach((pubKey: Buffer) => {
      pubKeysBuffer = Buffer.concat([
        pubKeysBuffer,
        Buffer.from([PUBLIC_KEY_LENGTH]),
        pubKey,
      ]);
    });
    
    const redeemScript = Buffer.concat([
      op_n,
      pubKeysBuffer,
      op_m,
      Buffer.from([OP_CHECKMULTISIG]),
    ]);
    // console.log('self', redeemScript.toString('hex'));

    // P2SH
    const scriptHash = hash160(redeemScript);
    const addressP2SH = base58checkEncode(
      Buffer.concat([Buffer.from([MAINNET_PREFIX]), scriptHash]),
    );
    // console.log('self', redeemScript.toString('hex'));
    // console.log('self', addressP2SH, addressP2SH === address);

    outputForm.setFieldsValue({ address: addressP2SH });
  };

  return (
    <>
      <StyledRow>
        <Col offset={4} span={16}>
          <Title level={4}>Input:</Title>
        </Col>
      </StyledRow>

      <Form {...layout} form={inputForm} onFinish={onFinish}>
        <Form.Item
          name="m"
          label="m"
          rules={[{ required: true, validator: validateM }]}
        >
          <InputNumber
            min={1}
            max={15}
            placeholder="number of public keys"
            style={{ width: '40%' }}
          />
        </Form.Item>

        <Form.Item
          name="n"
          label="n"
          rules={[{ required: true, validator: validateN }]}
        >
          <InputNumber
            min={1}
            max={15}
            placeholder="number of signatures to use this address"
            style={{ width: '40%' }}
          />
        </Form.Item>

        <Form.List
          name="publicKeys"
          // rules={[
          //   {
          //     validator: async (_, publicKeys) => {
          //       if (!publicKeys || publicKeys.length < 2) {
          //         throw Error('At least 2 public keys');
          //       }
          //     },
          //   },
          // ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  {...(index === 0 ? layout : tailLayout)}
                  label={index === 0 ? 'Public Keys' : ''}
                  required={false}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        validator: validatePublicKey,
                      },
                    ]}
                    noStyle
                  >
                    <Input placeholder="public key" style={{ width: '80%' }} />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item {...tailLayout}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '30%' }}
                  icon={<PlusOutlined />}
                >
                  Add Public Key
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>

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

      <Form {...layout} form={outputForm}>
        <Form.Item name="address" label="Generated Address">
          <Input placeholder="for output only" />
        </Form.Item>
      </Form>
    </>
  );
};

export default GenerateMultiSigP2SHAddress;

const StyledRow = styled(Row)`
  margin-bottom: 10px;
`;
