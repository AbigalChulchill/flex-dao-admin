import { useEffect, useState } from "react";
import { utils } from 'ethers';
import { Form, Input, Button, Modal, List, Divider, message, Typography } from "antd";

import { errorHandle } from "../../utils";

const { Paragraph } = Typography;

async function getBalanceOf(flexUSD, value) {
  try {
    return await flexUSD.balanceOf(value);
  } catch (err) {
    errorHandle('getBalanceOf', err);
  }
}

export function FlexUSD({ flexUSD, initialData, conn, config, bridge }) {
  const [contractName, setContractName] = useState();
  const [addr, setAddr] = useState();

  const [admin, setAdmin] = useState();
  const [name, setName] = useState();
  const [symbol, setSymbol] = useState();
  const [multiplier, setMultiplier] = useState();
  const [totalSupply, setTotalSupply] = useState();

  const [walletAddress, setWalletAddress] = useState();

  const [form] = Form.useForm();

  const [visible, setVisible] = useState();
  const [confirmLoading, setConfirmLoading] = useState();
  const [modalText, setModalText] = useState();
  
  useEffect(() => {
    async function fetchData() {
      try {
        if (flexUSD && initialData) {
          
          setContractName('FLEXUSD');
          setAddr(flexUSD.address);
          
          const {flexUSDAdmin,flexUSDName, flexUSDSymbol, flexUSDMultiplier, flexUSDTotalSupply} = initialData;
          if (flexUSDAdmin) setAdmin(flexUSDAdmin);
          if (flexUSDName) setName(flexUSDName);
          if (flexUSDSymbol) setSymbol(flexUSDSymbol);
          if (flexUSDMultiplier) setMultiplier(utils.formatEther(flexUSDMultiplier));
          if (flexUSDTotalSupply) setTotalSupply(utils.formatEther(flexUSDTotalSupply));

          const sender = await conn.getSigner().getAddress();
          setWalletAddress(sender);
        }
      } catch (err) {
        errorHandle('flexUSD initial', err);
      }
    }
    fetchData();
    return () => {
      setName();
      setAddr();
      setAdmin();
      setTotalSupply();
    }
  }, [flexUSD, initialData, conn, config, form, bridge]);

  const onBalanceOf = async (values) => {
    try {
      const address = values.address.trim();
      setVisible(true);
      if (!flexUSD || !address) {
        setModalText('chain is not ready');
        return;
      }
      setModalText('Querying ...');
      setConfirmLoading(true);
      const _balanceOf = await getBalanceOf(flexUSD, address);
      setModalText(`${address}: ${utils.formatEther(_balanceOf)} FlexUSD`)
      setConfirmLoading(false);
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
      errorHandle('onInitialize', err);
    }
  }

  const onInitialize = async (values) => {
    try {
      setVisible(true);
      const amountBn = utils.parseEther(values.amount);
      if (!flexUSD || !amountBn) {
        setModalText('chain is not ready');
        return;
      }
      setModalText("Sign and start to send on extension wallet ...");
      setConfirmLoading(true);
      const gasLimitBn = await flexUSD.estimateGas.initialize(amountBn);
      const tx = await flexUSD.initialize(amountBn, {
        gasLimit: gasLimitBn,
      })
      setModalText(`Sending Tx ... : ${tx.hash}`);
      const receipt = await tx.wait(2);
      setConfirmLoading(false);
      setModalText(`Confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
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
      errorHandle('onInitialize', err);
    }
  }

  const onSetTotalSupply = async (values) => {
    try {
      setVisible(true);
      const amountBn = utils.parseEther(values.amount);
      if (!flexUSD || !amountBn) {
        setModalText('chain is not ready');
        return;
      }
      setModalText("Sign and start to send on extension wallet ...");
      setConfirmLoading(true);
      const gasLimitBn = await flexUSD.estimateGas.setTotalSupply(amountBn);
      const tx = await flexUSD.setTotalSupply(amountBn, {
        gasLimit: gasLimitBn,
      })
      setModalText(`Sending Tx ... : ${tx.hash}`);
      const receipt = await tx.wait(2);
      setConfirmLoading(false);
      setModalText(`Confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
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
      errorHandle('onSetTotalSupply', err);
    }
  }

  const onMint = async (values) => {
    try {
      setVisible(true);
      const address = values.address.trim();
      const amountBn = utils.parseEther(values.amount);
      if (!flexUSD || !amountBn || !address) {
        setModalText('chain is not ready');
        return;
      }
      setModalText("Sign and start to send on extension wallet ...");
      setConfirmLoading(true);
      const gasLimitBn = await flexUSD.estimateGas.mint(address, amountBn);
      const tx = await flexUSD.mint(address, amountBn, {
        gasLimit: gasLimitBn,
      })
      setModalText(`Sending Tx ... : ${tx.hash}`);
      const receipt = await tx.wait(2);
      setConfirmLoading(false);
      setModalText(`Confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
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
      errorHandle('onMint', err);
    }
  }
  
  const onBurn = async (values) => {
    try {
      setVisible(true);
      const address = values.address.trim();
      const amountBn = utils.parseEther(values.amount);
      if (!flexUSD || !amountBn || !address) {
        setModalText('chain is not ready');
        return;
      }
      setModalText("Sign and start to send on extension wallet ...");
      setConfirmLoading(true);
      const gasLimitBn = await flexUSD.estimateGas.burn(address, amountBn);
      const tx = await flexUSD.burn(address, amountBn, {
        gasLimit: gasLimitBn,
      })
      setModalText(`Sending Tx ... : ${tx.hash}`);
      const receipt = await tx.wait(2);
      setConfirmLoading(false);
      setModalText(`Confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
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
      errorHandle('onBurn', err);
    }
  }

  const addressInputStyle = {
    style: {
      width: "600px"
    }
  }

  const amountInputStyle = {
    style: {
      width: "300px"
    }
  }

  const onFireblocksSetTotalSupply = () => {
    if (!bridge) {
      return message.error('Fireblocks Credentials are not provided!');
    }
    console.log(bridge);
    
  }
  
  const onFireblocksMint = () => {
    if (!bridge) {
      return message.error('Fireblocks Credentials are not provided!');
    }
    console.log(bridge);
  }

  const onFireblocksBurn = () => {
    if (!bridge) {
      return message.error('Fireblocks Credentials are not provided!');
    }
    console.log(bridge);
  }

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const listData = [
    {
      title: 'Address',
      value: addr
    },
    {
      title: 'Admin',
      value: admin
    },
    {
      title: 'Name',
      value: name
    },
    {
      title: 'Symbol',
      value: symbol
    },
    {
      title: 'Multiplier',
      value: multiplier
    },
    {
      title: 'Total Supply',
      value: `${totalSupply} FlexUSD`
    }
  ]

  const addressTypeRules = [
    {
      required: true,
      message: 'please input address',
    },
    {
      validator: (_, value) =>
        utils.isAddress(value.trim()) ? Promise.resolve() : Promise.reject(new Error('It is not a valid address')),
    },
  ]

  const amountTypeRules = [
    {
      required: true,
      message: 'please input amount',
      pattern: new RegExp(/^\d*\.?\d*$/),
    },
  ]

  return (
    <>
      <div className="box">
        <Divider orientation="left">
          {contractName} - <a href={config.explorer + config.flexusd} target="_blank" rel="noreferrer" >Check on Explorer </a> - <a href={config.chain_id === "1"? "/ABI/FlexUSDEth.json" : "/ABI/FlexUSDImplV2.json"} target="_blank" rel="noreferrer" >Logic ABI</a> - <a href={config.chain_id === "1"? "/ABI/FlexUSDEthProx.json" : "/ABI/FlexUSD.json"} target="_blank" rel="noreferrer" >Proxy ABI</a>
        </Divider>
        <List
          dataSource={listData}
          bordered
          grid={{ column: 2 }}
          renderItem={item => 
            <List.Item>
              <List.Item.Meta 
                title={item.title}
                description={<Paragraph copyable>{item.value}</Paragraph>}
              />
            </List.Item>
          }
        />
        <Divider orientation="left">
          Read From Contract
        </Divider>
        <ul>
          <li>
            <Form
              layout="inline"
              onFinish={onBalanceOf}
            >
              <Form.Item
                label="FlexUSD Balance" 
                name="address"                   
                rules={addressTypeRules}
                {...addressInputStyle}
              >
                <Input
                  placeholder="address" 
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Read</Button>
              </Form.Item>
            </Form>
          </li>
        </ul>
        <Divider orientation="left">
          Write To Contract
        </Divider>
        <ul>
          <li>
            <div>Connected wallet: 
              <Paragraph copyable>{walletAddress}</Paragraph>
            </div>
          </li>
          <li>
            <Form
              layout="inline"
              onFinish={onInitialize}
            >
              <Form.Item
                label="initialize" 
                name="amount"                   
                rules={amountTypeRules}
                {...amountInputStyle}
              >
                <Input placeholder="amount (ETH Unit)" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Write</Button>
              </Form.Item>
            </Form>
          </li>
          <li>
            <Form
              layout="inline"
              onFinish={onSetTotalSupply}
            >
              <Form.Item
                label="setTotalSupply" 
                name="amount"                   
                rules={amountTypeRules}
                {...amountInputStyle}
              >
                <Input placeholder="amount (ETH Unit)" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Write</Button>
              </Form.Item>
            </Form>
          </li>
          <li>
            <Form
              layout="inline"
              onFinish={onMint}
            >
              <Form.Item
                label="mint" 
                name="address"                   
                rules={addressTypeRules}
                {...addressInputStyle}
              >
                <Input
                  placeholder="address" 
                />
              </Form.Item>
              <Form.Item
                name="amount"                   
                rules={amountTypeRules}
              >
                <Input placeholder="amount (ETH Unit)" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Write</Button>
              </Form.Item>
            </Form>
          </li>
          <li>
            <Form
              layout="inline"
              onFinish={onBurn}
            >
              <Form.Item
                label="burn" 
                name="address"                   
                rules={addressTypeRules}
                {...addressInputStyle}
              >
                <Input
                  placeholder="address" 
                />
              </Form.Item>
              <Form.Item
                name="amount"                   
                rules={amountTypeRules}
              >
                <Input placeholder="amount (ETH Unit)" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Write</Button>
              </Form.Item>
            </Form>
          </li>
        </ul>
      </div>
      { config.fireblocks && 
        <div className="box">
          <Divider orientation="left">
            API calls to contracts thru Fireblocks MPC
          </Divider>
          <ul>
            <li>
              <Form
                layout="inline"
                onFinish={onFireblocksSetTotalSupply}
              >
                <Form.Item
                  label="setTotalSupply" 
                  name="amount"                   
                  rules={amountTypeRules}
                >
                  <Input placeholder="amount (ETH Unit)" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">Send</Button>
                </Form.Item>
              </Form>
            </li>
            <li>
              <Form
                layout="inline"
                onFinish={onFireblocksMint}
              >
                <Form.Item
                  label="mint" 
                  name="address"
                  rules={addressTypeRules}
                  {...addressInputStyle}
                >
                <Input
                  placeholder="address" 
                />
                </Form.Item>
                <Form.Item 
                  name="amount"
                  rules={amountTypeRules}
                >
                  <Input placeholder="amount (ETH Unit)" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">Send</Button>
                </Form.Item>
              </Form>
            </li>
            <li>
              <Form
                layout="inline"
                onFinish={onFireblocksBurn}
              >
                <Form.Item 
                  label="burn" 
                  name="address"
                  rules={addressTypeRules}
                  {...addressInputStyle}
                >
                <Input
                  placeholder="address" 
                />
                </Form.Item>
                <Form.Item 
                  name="amount"
                  rules={amountTypeRules}
                >
                  <Input placeholder="amount (ETH Unit)" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">Send</Button>
                </Form.Item>
              </Form>
            </li>
          </ul>
        </div>
      }
      <Modal
        title="Result"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        maskClosable={false}
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
}
