import { useEffect, useContext } from "react";
import { Form, Input, Button, Space } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { errorHandle } from "../utils";
import { GlobalContext} from '../App';

export function GlobalConfig() {
  const [form] = Form.useForm();

  const {
    apiSecret,
    apiKey,
    apiAccountId,
    apiWalletId,
    onInputCredential,
    onResetCredential 
  } = useContext(GlobalContext);
  
  useEffect(() => {
    async function fetchData() {
      try {
        if (apiSecret && apiKey && apiAccountId && apiWalletId) {
          form.setFieldsValue({
            api_secret: apiSecret
          });
          form.setFieldsValue({
            api_key: apiKey
          });
          form.setFieldsValue({
            api_account_id: apiAccountId
          });
          form.setFieldsValue({
            api_wallet_id: apiWalletId
          });
        }
      } catch (err) {
        errorHandle('global config initial', err);
      }
    }
    fetchData();
    return () => {
    }
  });

  return (
    <>
      <div className="box">
        <div className="bulletin">
          <h3>Fireblocks MPC Service</h3>
        </div>
        <div className="query">
          <div className="words">
            <p>Credentials will be loaded from local storage of explorer if exist, otherwise please provide it!</p>
          </div>
          <Form
            form={form}
            onFinish={onInputCredential}
            wrapperCol={{ span: 8 }}
            labelCol={{ span: 4 }}
            initialValues={{
              size: "small"
            }}
          >
            <Form.Item
              label="API Secret"
              name="api_secret"
              rules={[
                {
                  required: true,
                  message: 'please input api secret',
                },
              ]}
            >
              <Input.Password
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
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
              label="Vault Account Id"
              name="api_account_id"
              rules={[
                {
                  required: true,
                  message: 'please input vault account id',
                },
              ]}
              wrapperCol={{ span: 4}}
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
              wrapperCol={{ span: 4}}
            >
              <Input.Password
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Form.Item
              wrapperCol={{ offset: 4}}
            >
              <Space size={120}>
                <Button type="primary" htmlType="submit">
                  Apply
                </Button>
                <Button type="primary" danger htmlType="button" onClick={()=>{ onResetCredential(form) }}>
                  Clear
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}
