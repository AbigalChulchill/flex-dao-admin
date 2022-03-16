import { useEffect, useState, useContext } from "react";
import { Form, Input, Button, Space, Divider, Typography, Upload, message, Modal } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, UploadOutlined } from "@ant-design/icons";
import { FireblocksSDK } from "fireblocks-sdk";

import { errorHandle } from "../utils";
import { GlobalContext} from '../App';

const { Text } = Typography;

export function Fireblocks() {
  const [formAPI] = Form.useForm();
  const [formID] = Form.useForm();

  const [visible, setVisible] = useState();
  const [confirmLoading, setConfirmLoading] = useState();
  const [modalText, setModalText] = useState();

  const {
    apiSecret,
    apiKey,
    apiAccountId,
    apiWalletId,
    onInputAPI,
    onResetAPI,
    onInputID,
    onResetID
  } = useContext(GlobalContext);
  
  useEffect(() => {
    async function fetchData() {
      try {
        formAPI.setFieldsValue({
          api_secret: apiSecret
        });
        formAPI.setFieldsValue({
          api_key: apiKey
        });
        formID.setFieldsValue({
          api_account_id: apiAccountId
        });
        formID.setFieldsValue({
          api_wallet_id: apiWalletId
        });
      } catch (err) {
        errorHandle('global config initial', err);
      }
    }
    fetchData();
    return () => {
    }
  });

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const getFireblocks = () => {
    if (apiKey && apiSecret) {
      return new FireblocksSDK(apiSecret, apiKey);
    } else {
      message.error("api key or secret is missing!");
      return undefined;
    }
  }

  const onVaultIdByName = async (values) => {
    try {
      const fireblocks = getFireblocks();
      if (!fireblocks) return;
      setVisible(true);
      const name = values.vaultName.trim();
      if (!name) {
        setModalText('params are not ready');
        return;
      }
      setModalText("Querying to Fireblocks ...");
      setConfirmLoading(true);
      const rs = await fireblocks.getVaultAccounts({namePrefix: name});
      setConfirmLoading(false);
      setModalText(`ID is ${rs}`);
    } catch (err) {
      setConfirmLoading(false);
      if (typeof(err) === 'string') {
        setModalText(err);
      } else {
        if (err.data && err.data.message) {
          setModalText(err.data.message);
        }
        else if (err.message) {
          setModalText(err.message);
        }
      }
      errorHandle('onVaultIdByName', err);
    }

  }

  const onWalletIdByName = (values) => {

  }

  const nameInputStyle = {
    style: {
      width: "400px"
    }
  }

  return (
    <div className="container">
      <h1>Fireblocks Settings</h1>
      <Text type="warning">        
        API info will be cached in local storage of explorer, you can remove them by click Clear button
      </Text>
      <div className="box">
        <Divider orientation="left">
          Fireblocks API Settings
        </Divider>
        <div className="warningMsg">
        </div>
        <Form
          form={formAPI}
          onFinish={onInputAPI}
          wrapperCol={{ span: 6 }}
          labelCol={{ span: 3 }}
          initialValues={{
            size: "small"
          }}
        >
          <Form.Item
            label="API Key"
            name="api_key"
            rules={[
              {
                required: true,
                message: 'please input api key',
              },
            ]}
          >
            <Input.Password
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <Form.Item
            label="API Secret"
            name="api_secret"
            valuePropName="file"
            rules={[
              {
                required: true,
                message: 'please upload api secret',
              },
            ]}
          >
            <Upload beforeUpload={()=> {
              return false;
            }} maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            wrapperCol={{ offset: 3}}
          >
            <Space size={50}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
              <Button type="primary" danger htmlType="button" onClick={()=>{ onResetAPI(formAPI) }}>
                Clear
              </Button>
            </Space>
          </Form.Item>
        </Form>
        <Divider orientation="left">
          Fireblocks SDK Query
        </Divider>
        <ul>
          <li>
            <Form
              layout="inline"
              onFinish={onVaultIdByName}
            >
              <Form.Item
                label="Get Vault ID by Name" 
                name="vaultName"                   
                rules={[
                  {
                    required: true,
                    message: 'please input vault name',
                  }
                ]}
                {...nameInputStyle}
              >
                <Input
                  placeholder="vault name" 
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Query</Button>
              </Form.Item>
            </Form>
          </li>
          <li>
            <Form
              layout="inline"
              onFinish={onWalletIdByName}
            >
              <Form.Item
                label="Get External Wallet ID by Name" 
                name="walletName"                   
                rules={[
                  {
                    required: true,
                    message: 'please input wallet name',
                  }
                ]}
                {...nameInputStyle}
              >
                <Input
                  placeholder="wallet name" 
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Query</Button>
              </Form.Item>
            </Form>
          </li>
        </ul>
        <Divider orientation="left">
          Fireblocks DeFi SDK Settings
        </Divider>
        <Form
          form={formID}
          onFinish={onInputID}
          wrapperCol={{ span: 2 }}
          labelCol={{ span: 3 }}
          initialValues={{
            size: "small"
          }}
        >
          <Form.Item
            label="Vault Account Id"
            name="api_account_id"
            rules={[
              {
                required: true,
                message: 'please input vault account id',
              },
            ]}
          >
            <Input.Password
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <Form.Item
            label="External Wallet Id"
            name="api_wallet_id"
            rules={[
              {
                required: true,
                message: 'please input external wallet id',
              },
            ]}
          >
            <Input.Password
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{ offset: 3}}
          >
            <Space size={50}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
              <Button type="primary" danger htmlType="button" onClick={()=>{ onResetID(formID) }}>
                Clear
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
      <Modal
        title="Result"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        maskClosable={false}
        closable={false}
      >
        <p>{modalText}</p>
      </Modal>
    </div>
  );
}
