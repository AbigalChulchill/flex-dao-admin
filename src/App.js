import { Layout, Menu } from 'antd';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useEffect, useState, createContext } from 'react';

import { FlexPage } from './pages/FlexPage';
import { FlexUSDPage } from './pages/FlexUSDPage';
import { FlexDaoPage } from './pages/FlexDaoPage';
import { getConn } from './conn';
import { errorHandle } from "./utils";

import './App.css';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export const ConnectionContext = createContext(null);

function App() {

  const [conn, setConn] = useState();
  const [collapsed, setCollapsed] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const _conn = await getConn();
        if (_conn) {
          setConn(_conn);
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
          window.ethereum.on('accountsChanged', () => {
            window.location.reload();
          });
        } 
      } catch (err) {
        errorHandle('init connection with blockchain', err);
      }
    }
    fetchData();
  }, [conn]);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  }

  return (
    <ConnectionContext.Provider value={{conn}}> 
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <SubMenu key="sub1" title="Flex">
                <SubMenu key="sub2" title="SmartBCH">
                  <Menu.Item key="1">PP</Menu.Item>
                  <Menu.Item key="2">Stage</Menu.Item>
                  <Menu.Item key="3">Prod</Menu.Item>
                </SubMenu>
              </SubMenu>
              <SubMenu key="sub3" title="FlexDAO">
                <SubMenu key="sub4" title="SmartBCH">
                  <Menu.Item key="4">PP</Menu.Item>
                  <Menu.Item key="5">Stage</Menu.Item>
                  <Menu.Item key="6">Prod</Menu.Item>
                </SubMenu>
              </SubMenu>
              <SubMenu key="sub5" title="FlexUSD">
                <SubMenu key="sub6" title="Ethereum">
                  <Menu.Item key="7">PP</Menu.Item>
                  <Menu.Item key="8">Stage</Menu.Item>
                  <Menu.Item key="9">Prod</Menu.Item>
                </SubMenu>
                <SubMenu key="sub7" title="SmartBCH">
                  <Menu.Item key="10">PP</Menu.Item>
                  <Menu.Item key="11">Stage</Menu.Item>
                  <Menu.Item key="12">Prod</Menu.Item>
                </SubMenu>
                <SubMenu key="sub8" title="Avalanche">
                  <Menu.Item key="13">PP</Menu.Item>
                  <Menu.Item key="14">Stage</Menu.Item>
                  <Menu.Item key="15">Prod</Menu.Item>
                </SubMenu>
                <SubMenu key="sub9" title="Polygon">
                  <Menu.Item key="16">PP</Menu.Item>
                  <Menu.Item key="17">Stage</Menu.Item>
                  <Menu.Item key="18">Prod</Menu.Item>
                </SubMenu>
                <SubMenu key="sub10" title="Fantom Opera (FTM)">
                  <Menu.Item key="19">PP</Menu.Item>
                  <Menu.Item key="20">Stage</Menu.Item>
                  <Menu.Item key="21">Prod</Menu.Item>
                </SubMenu>
                <SubMenu key="sub11" title="Binance Smart Chain">
                  <Menu.Item key="22">PP</Menu.Item>
                  <Menu.Item key="23">Stage</Menu.Item>
                  <Menu.Item key="24">Prod</Menu.Item>
                </SubMenu>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 5 }}>
              <h1>CoinFLEX Contracts Tools</h1>
            </Header>
            <Content style={{ margin: '0 16px' }}>
              <Switch>
                <Route path='/' exact>
                  <Redirect to='/flex-dao' />
                </Route>
                <Route path='/flex'>
                  <FlexPage />
                </Route>
                <Route path='/flexusd'>
                  <FlexUSDPage />
                </Route>
                <Route path='/flex-dao'>
                  <FlexDaoPage/>
                </Route>
              </Switch>
            </Content>
            <Footer style={{ textAlign: 'center' }}>CoinFLEX contracts tools ©2022 Created by Team De-Fi</Footer>
          </Layout>
        </Layout>
    </ConnectionContext.Provider>
  );
}

export default App; 