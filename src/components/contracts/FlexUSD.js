import { useEffect, useState } from "react";
import { utils } from 'ethers';
import { Form, Input, Button, Space, Modal } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { errorHandle } from "../../utils";

async function getBalanceOf(flexUSD, value) {
  try {
    return await flexUSD.balanceOf(value);
  } catch (err) {
    errorHandle('getBalanceOf', err);
  }
}

export function FlexUSD({ flexUSD, initialData, conn, config }) {
  const [contractName, setContractName] = useState();
  const [addr, setAddr] = useState();

  const [admin, setAdmin] = useState();
  const [name, setName] = useState();
  const [symbol, setSymbol] = useState();
  const [multiplier, setMultiplier] = useState();
  const [totalSupply, setTotalSupply] = useState();

  const [querying, setQuerying] = useState();

  const [addressBalanceOf, setAddressBalanceOf] = useState();
  const [balanceOf, setBalanceOf] = useState();

  const [txStatus, setTxStatus] = useState();
  const [txStatusText, setTxStatusText] = useState();
  const [walletAddress, setWalletAddress] = useState();

  const [amountForInitialize, setAmountForInitialize] = useState();
  const [amountForSetTotalSupply, setAmountForSetTotalSupply] = useState();

  const [addressForMint, setAddressForMint] = useState();
  const [amountForMint, setAmountForMint] = useState();

  const [addressForBurn, setAddressForBurn] = useState();
  const [amountForBurn, setAmountForBurn] = useState();

  const [form] = Form.useForm();

  const [apiSecret, setApiSecret] = useState();
  const [apiKey, setApiKey] = useState();
  const [apiAccountId, setApiAccountId] = useState();
  const [apiWalletId, setApiWalletId] = useState();
  
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

          const localStorage = window.localStorage;
          const api_secret = localStorage.getItem('api_secret');
          const api_key = localStorage.getItem('api_key');
          const api_account_id = localStorage.getItem('api_account_id');
          const api_wallet_id = localStorage.getItem('api_wallet_id');
          if (api_secret && api_key && api_account_id && api_wallet_id) {
            setApiSecret(api_secret);
            setApiKey(api_key);
            setApiAccountId(api_account_id);
            setApiWalletId(api_wallet_id);

            form.setFieldsValue({
              api_secret: api_secret
            });
            form.setFieldsValue({
              api_key: api_key
            });
            form.setFieldsValue({
              api_account_id: api_account_id
            });
            form.setFieldsValue({
              api_wallet_id: api_wallet_id
            });
          }
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
  }, [flexUSD, initialData, conn, config, form]);

  const onBalanceOf = async (e) => {
    e.preventDefault();
    setBalanceOf(undefined);
    if (querying) return;
    setQuerying(true);
    if (flexUSD && addressBalanceOf) {
      const _balanceOf = await getBalanceOf(flexUSD, addressBalanceOf);
      if (_balanceOf) setBalanceOf(utils.formatEther(_balanceOf));
    }
    setQuerying(false);
  }

  const onInitialize = async (e) => {
    try {
      e.preventDefault();
      if (amountForInitialize) {
        setTxStatus(true);
        const amountBn = utils.parseEther(amountForInitialize);
        const gasLimitBn = await flexUSD.estimateGas.initialize(amountBn);
        const tx = await flexUSD.initialize(amountBn, {
          gasLimit: gasLimitBn,
        })
        setTxStatusText(`pending - ${tx.hash}`);
        const receipt = await tx.wait(2);
        setTxStatus(false);
        setTxStatusText(`confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
      }
    } catch (err) {
      if (typeof(err) === 'string') {
        setTxStatusText(err);
      } else {
        if (err.data && err.data.message) {
          setTxStatusText(err.data.message);
        }
        else if (err.message) {
          setTxStatusText(err.message);
          if (err.message.includes('transaction was replaced')) {
            setTxStatus(false);
          }
        }
      }
      errorHandle('onInitialize', err);
    }
  }

  const onSetTotalSupply = async (e) => {
    try {
      e.preventDefault();
      if (amountForSetTotalSupply) {
        setTxStatus(true);
        const amountBn = utils.parseEther(amountForSetTotalSupply);
        const gasLimitBn = await flexUSD.estimateGas.setTotalSupply(amountBn);
        const tx = await flexUSD.setTotalSupply(amountBn, {
          gasLimit: gasLimitBn,
        })
        setTxStatusText(`pending - ${tx.hash}`);
        const receipt = await tx.wait(2);
        setTxStatus(false);
        setTxStatusText(`confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
      }
    } catch (err) {
      if (typeof(err) === 'string') {
        setTxStatusText(err);
      } else {
        if (err.data && err.data.message) {
          setTxStatusText(err.data.message);
        }
        else if (err.message) {
          setTxStatusText(err.message);
          if (err.message.includes('transaction was replaced')) {
            setTxStatus(false);
          }
        }
      }
      errorHandle('onSetTotalSupply', err);
    }
  }

  const onMint = async (e) => {
    try {
      e.preventDefault();
      if (addressForMint && amountForMint) {
        setTxStatus(true);
        const amountBn = utils.parseEther(amountForMint);
        const gasLimitBn = await flexUSD.estimateGas.mint(addressForMint, amountBn);
        const tx = await flexUSD.mint(addressForMint, amountBn, {
          gasLimit: gasLimitBn,
        })
        setTxStatusText(`pending - ${tx.hash}`);
        const receipt = await tx.wait(2);
        setTxStatus(false);
        setTxStatusText(`confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
      }
    } catch (err) {
      if (typeof(err) === 'string') {
        setTxStatusText(err);
      } else {
        if (err.data && err.data.message) {
          setTxStatusText(err.data.message);
        }
        else if (err.message) {
          setTxStatusText(err.message);
          if (err.message.includes('transaction was replaced')) {
            setTxStatus(false);
          }
        }
      }
      errorHandle('onMint', err);
    }
  }

  const onBurn = async (e) => {
    try {
      e.preventDefault();
      if (addressForBurn && amountForBurn) {
        setTxStatus(true);
        const amountBn = utils.parseEther(amountForBurn);
        const gasLimitBn = await flexUSD.estimateGas.burn(addressForBurn, amountBn);
        const tx = await flexUSD.burn(addressForBurn, amountBn, {
          gasLimit: gasLimitBn,
        })
        setTxStatusText(`pending - ${tx.hash}`);
        const receipt = await tx.wait(2);
        setTxStatus(false);
        setTxStatusText(`confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
      }
    } catch (err) {
      if (typeof(err) === 'string') {
        setTxStatusText(err);
      } else {
        if (err.data && err.data.message) {
          setTxStatusText(err.data.message);
        }
        else if (err.message) {
          setTxStatusText(err.message);
          if (err.message.includes('transaction was replaced')) {
            setTxStatus(false);
          }
        }
      }
      errorHandle('onBurn', err);
    }
  }

  const addressInputStyle = {
    style: {
      width: "450px"
    }
  }

  const onInputCredential = (value) => {
    if (value) {
      setApiSecret(value.api_secret);
      setApiKey(value.api_key);
      setApiAccountId(value.api_account_id);
      setApiWalletId(value.api_wallet_id);

      const localStorage = window.localStorage;
      localStorage.setItem('api_secret', value.api_secret);
      localStorage.setItem('api_key', value.api_key);
      localStorage.setItem('api_account_id', value.api_account_id);
      localStorage.setItem('api_wallet_id', value.api_wallet_id);

      Modal.info({
        title: "INFO",
        content: (
          <>
            <p>The credential has been applied and saved on browser local storage</p>
            <p>If you want to remove it from local storage, click Clear button</p>
          </>
        ),
        onOk() {},
      });
    }
  }

  const onResetCredential = () => {
    form.setFieldsValue({
      api_secret: '',
      api_key: '',
      api_account_id: '',
      api_wallet_id: '',
    })

    setApiSecret();
    setApiKey();
    setApiAccountId();
    setApiWalletId();

    localStorage.removeItem('api_secret');
    localStorage.removeItem('api_key');
    localStorage.removeItem('api_account_id');
    localStorage.removeItem('api_wallet_id');

    Modal.info({
      title: "INFO",
      content: (
        <>
          <p>The credential has been removed from browser local storage</p>
        </>
      ),
      onOk() {},
    });
  }

  const showNoCredentialError = () => {
    Modal.error({
      title: "Error",
      content: (
        <>
          <p>Fireblocks Credentials are not provided!</p>
        </>
      )
    });
  }

  const onFireblocksSetTotalSupply = () => {
    if (!apiSecret || !apiKey || !apiAccountId || !apiWalletId) {
      return showNoCredentialError();
    }
    
  }
  
  const onFireblocksMint = () => {
    if (!apiSecret || !apiKey || !apiAccountId || !apiWalletId) {
      return showNoCredentialError();
    }
  }
  const onFireblocksBurn = () => {
    if (!apiSecret || !apiKey || !apiAccountId || !apiWalletId) {
      return showNoCredentialError();
    }
  }

  return (
    <>
      <div className="box">
        <div className="info">
          <div className="bulletin">
            == Contract Name: {contractName} - <a href={config.explorer + config.flexusd} target="_blank" rel="noreferrer" >Check on Explorer </a> - <a href={config.chain_id === "1"? "/ABI/FlexUSDEth.json" : "/ABI/FlexUSDImplV2.json"} target="_blank" rel="noreferrer" >Logic ABI</a> - <a href={config.chain_id === "1"? "/ABI/FlexUSDEthProx.json" : "/ABI/FlexUSD.json"} target="_blank" rel="noreferrer" >Proxy ABI</a> ==
          </div>
          <ul>
            <li>Addr: {addr}</li>
            <li>Admin: {admin}</li>
            <li>Name: {name}</li>
            <li>Symbol: {symbol}</li>
            <li>Multiplier: {multiplier}</li>
            <li>Total Supply: {totalSupply} FlexUSD</li>
          </ul>
        </div>
        <div className="query">
          <div className={"status-" + (querying ? "on" : "off")}>
            == Query Status: {querying ? "Querying" : "Not Query"} ==
          </div>
          <ul>
            <li>
              <form>
                <label>
                  Account Balance Of:
                </label>
                <input type="text" placeholder="address" size="50" onChange={ e => setAddressBalanceOf(e.target.value)} />
                <button onClick={onBalanceOf}>Read</button>
                <span>{balanceOf} {balanceOf ? 'FlexUSD' : ''}</span>
              </form>
            </li>
          </ul>
        </div>
        <div className="query">
          <div className={"status-" + (txStatus ? "on" : "off")}>
            == Tx Status: {txStatusText} ==
          </div>
          <ul>
            <p>Connected wallet: {walletAddress}</p>
            <p></p>
            <li>
              <form>
                <label>
                  initialize:
                </label>
                <input type="text" placeholder="amount (ETH Unit)" onChange={e=>setAmountForInitialize(e.target.value)} />
                <button onClick={onInitialize}>Write</button>
              </form>
            </li>
            <li>
              <form>
                <label>
                  setTotalSupply:
                </label>
                <input type="text" placeholder="amount (ETH Unit)" onChange={e=>setAmountForSetTotalSupply(e.target.value)} />
                <button onClick={onSetTotalSupply}>Write</button>
              </form>
            </li>
            <li>
              <form>
                <label>
                  mint:
                </label>
                <input type="text" placeholder="address" size="50" onChange={e=>setAddressForMint(e.target.value)} />
                <input type="text" placeholder="amount (ETH Unit)" onChange={e=>setAmountForMint(e.target.value)} />
                <button onClick={onMint}>Write</button>
              </form>
            </li>
            <li>
              <form>
                <label>
                  burn:
                </label>
                <input type="text" placeholder="address" size="50" onChange={e=>setAddressForBurn(e.target.value)} />
                <input type="text" placeholder="amount (ETH Unit)" onChange={e=>setAmountForBurn(e.target.value)} />
                <button onClick={onBurn}>Write</button>
              </form>
            </li>
          </ul>
        </div>
      </div>
      <div className="box">
        <div className="info">
            <div className="bulletin">
              == Fireblocks MPC Service ==
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
                    <Button type="primary" danger htmlType="button" onClick={onResetCredential}>
                      Clear
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
            <div className="query">
              <div className="words">
                <p>API calls to contracts thru Fireblocks MPC</p>
              </div>
              <ul>
                <li>
                  <Form
                    layout="inline"
                    onFinish={onFireblocksSetTotalSupply}
                  >
                    <Form.Item
                      label="setTotalSupply" 
                      name="amount"                   
                      rules={[
                        {
                          required: true,
                          message: 'please input total supply',
                        },
                      ]}
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
                      rules={[
                        {
                          required: true,
                          message: 'please input address',
                        },
                      ]}
                      {...addressInputStyle}
                    >
                      <Input placeholder="address" />
                    </Form.Item>
                    <Form.Item 
                      name="amount"
                      rules={[
                        {
                          required: true,
                          message: 'please input amount',
                        },
                      ]}
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
                      rules={[
                        {
                          required: true,
                          message: 'please input address',
                        },
                      ]}
                      {...addressInputStyle}
                    >
                      <Input placeholder="address" />
                    </Form.Item>
                    <Form.Item 
                      name="amount"
                      rules={[
                        {
                          required: true,
                          message: 'please input amount',
                        },
                      ]}
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

        </div>
      </div>
    </>
  );
}
