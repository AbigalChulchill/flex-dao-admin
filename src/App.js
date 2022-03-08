import { Layout, Menu, Modal } from 'antd';
import { Route, Switch, Link } from 'react-router-dom';
import { useEffect, useState, createContext } from 'react';

import { getConn } from './conn';
import { errorHandle } from "./utils";

import { FlexDaoSmartBCHPP } from './pages/FlexDaoSmartBCHPP';
import { FlexDaoSmartBCHProd } from './pages/FlexDaoSmartBCHProd';
import { FlexDaoSmartBCHStg } from './pages/FlexDaoSmartBCHStg';
import { FlexSmartBCHPP } from './pages/FlexSmartBCHPP';
import { FlexSmartBCHProd } from './pages/FlexSmartBCHProd';
import { FlexSmartBCHStg } from './pages/FlexSmartBCHStg';
import { FlexUSDAvaxPP } from './pages/FlexUSDAvaxPP';
import { FlexUSDPolygonPP } from './pages/FlexUSDPolygonPP';
import { FlexUSDFTMPP } from './pages/FlexUSDFTMPP';
import { FlexUSDBSCPP } from './pages/FlexUSDBSCPP';
import { FlexUSDETHStg } from './pages/FlexUSDETHStg';
import { FlexUSDETHPP } from './pages/FlexUSDETHPP';
import { FlexUSDETHProd } from './pages/FlexUSDETHProd';
import { GlobalConfig } from './pages/GlobalConfig';
import './App.css';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export const GlobalContext = createContext(null);

function App() {

  const [conn, setConn] = useState();

  const [apiSecret, setApiSecret] = useState();
  const [apiKey, setApiKey] = useState();
  const [apiAccountId, setApiAccountId] = useState();
  const [apiWalletId, setApiWalletId] = useState();

  const [collapsed, setCollapsed] = useState();

  useEffect(() => {
    async function fetchData() {
      try { 
        const _conn = await getConn();
        if (_conn) {
          setConn(_conn);
        }
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
        }
      } catch (err) {
        Modal.error({
          title: "Error",
          content: (
            <>
              <p>{err}</p>
            </>
          )
        });
        errorHandle('initializing the site', err);
      }
    }
    fetchData();
  }, [conn]);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
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

  const onResetCredential = (form) => {
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

  return (
    <GlobalContext.Provider value={{
      conn,
      apiSecret,
      apiKey,
      apiAccountId,
      apiWalletId,
      onInputCredential,
      onResetCredential
    }}> 
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <SubMenu key="sub1" title="Flex">
                <SubMenu key="sub2" title="SmartBCH">
                  <Menu.Item key="1">
                    <Link to="/flex/smartbch/pp">PP</Link>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Link to="/flex/smartbch/stg">Stage</Link>
                  </Menu.Item>
                  <Menu.Item key="3">
                    <Link to="/flex/smartbch/prod">Prod</Link>
                  </Menu.Item>
                </SubMenu>
              </SubMenu>
              <SubMenu key="sub3" title="FlexDAO">
                <SubMenu key="sub4" title="SmartBCH">
                  <Menu.Item key="4">
                    <Link to="/flexdao/smartbch/pp">PP</Link>
                  </Menu.Item>
                  <Menu.Item key="5">
                    <Link to="/flexdao/smartbch/stg">Stage</Link>
                  </Menu.Item>
                  <Menu.Item key="6">
                    <Link to="/flexdao/smartbch/prod">Prod</Link >  
                  </Menu.Item>
                </SubMenu>
              </SubMenu>
              <SubMenu key="sub5" title="FlexUSD">
                <SubMenu key="sub6" title="Ethereum">
                  <Menu.Item key="7">
                    <Link to="/flexusd/ethereum/pp">PP</Link>
                  </Menu.Item>
                  <Menu.Item key="8">
                    <Link to="/flexusd/ethereum/stg">Stage</Link>
                  </Menu.Item>
                  <Menu.Item key="9">
                    <Link to="/flexusd/ethereum/prod">Prod</Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu key="sub7" title="SmartBCH">
                  <Menu.Item key="10">
                    <Link to="/flexusd/smartbch/pp">PP</Link>
                  </Menu.Item>
                  <Menu.Item key="11">
                    <Link to="/flexusd/smartbch/stg">Stage</Link>
                  </Menu.Item>
                  <Menu.Item key="12">
                    <Link to="/flexusd/smartbch/prod">Prod</Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu key="sub8" title="Avalanche">
                  <Menu.Item key="13">
                    <Link to="/flexusd/avax/pp">PP</Link>  
                  </Menu.Item>
                  <Menu.Item key="14">
                    <Link to="/flexusd/avax/stg">Stage</Link>
                  </Menu.Item>
                  <Menu.Item key="15">
                    <Link to="/flexusd/avax/prod">Prod</Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu key="sub9" title="Polygon">
                  <Menu.Item key="16">
                    <Link to="/flexusd/polygon/pp">PP</Link>
                  </Menu.Item>
                  <Menu.Item key="17">
                    <Link to="/flexusd/polygon/stg">Stage</Link>
                  </Menu.Item>
                  <Menu.Item key="18">
                    <Link to="/flexusd/polygon/prod">Prod</Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu key="sub10" title="Fantom Opera (FTM)">
                  <Menu.Item key="19">
                    <Link to="/flexusd/ftm/pp">PP</Link>
                  </Menu.Item>
                  <Menu.Item key="20">
                    <Link to="/flexusd/ftm/stg">Stage</Link>
                  </Menu.Item>
                  <Menu.Item key="21">
                    <Link to="/flexusd/ftm/prod">Prod</Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu key="sub11" title="Binance Smart Chain">
                  <Menu.Item key="22">
                    <Link to="/flexusd/bsc/pp">PP</Link>
                  </Menu.Item>
                  <Menu.Item key="23">
                    <Link to="/flexusd/bsc/stg">Stage</Link>
                  </Menu.Item>
                  <Menu.Item key="24">
                    <Link to="/flexusd/bsc/prod">Prod</Link>
                  </Menu.Item>
                </SubMenu>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="header">
              <h1><Link to="/">CoinFLEX Contracts Tools</Link></h1>
            </Header>
            <Content style={{ margin: '0 16px' }}>
              <Switch>
                <Route exact path='/flex/smartbch/pp'>
                  <FlexSmartBCHPP />
                </Route>
                <Route exact path='/flex/smartbch/prod'>
                  <FlexSmartBCHProd />
                </Route>
                <Route exact path='/flex/smartbch/stg'>
                  <FlexSmartBCHStg />
                </Route>
                <Route exact path='/flexdao/smartbch/pp'>
                  <FlexDaoSmartBCHPP />
                </Route>
                <Route exact path='/flexdao/smartbch/prod'>
                  <FlexDaoSmartBCHProd />
                </Route>
                <Route exact path='/flexdao/smartbch/stg'>
                  <FlexDaoSmartBCHStg />
                </Route>
                <Route exact path='/flexusd/avax/pp'>
                  <FlexUSDAvaxPP />
                </Route>
                <Route exact path='/flexusd/polygon/pp'>
                  <FlexUSDPolygonPP />
                </Route>
                <Route exact path='/flexusd/bsc/pp'>
                  <FlexUSDBSCPP />
                </Route>
                <Route exact path='/flexusd/ftm/pp'>
                  <FlexUSDFTMPP />
                </Route>
                <Route exact path='/flexusd/ethereum/pp'>
                  <FlexUSDETHPP />
                </Route>
                <Route exact path='/flexusd/ethereum/stg'>
                  <FlexUSDETHStg />
                </Route>
                <Route exact path='/flexusd/ethereum/prod'>
                  <FlexUSDETHProd />
                </Route>
                <Route path='/'>
                  <GlobalConfig />
                </Route>
              </Switch>
            </Content>
            <Footer style={{ textAlign: 'center' }}>CoinFLEX contracts tools ©2022 Created by Team De-Fi</Footer>
          </Layout>
        </Layout>
    </GlobalContext.Provider>
  );
}

export default App; 