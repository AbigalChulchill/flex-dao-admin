import { Layout, Menu } from 'antd';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
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
                  <Menu.Item key="1">
                    <Link to="/flex/smartbch/pp">PP</Link>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Link to="/flex/smartbch/stage">Stage</Link>
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
                    <Link to="/flexdao/smartbch/stage">Stage</Link>
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
                    <Link to="/flexusd/ethereum/stage">Stage</Link>
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
                    <Link to="/flexusd/smartbch/stage">Stage</Link>
                  </Menu.Item>
                  <Menu.Item key="12">
                    <Link to="/flexusd/smartbch/prod">Prod</Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu key="sub8" title="Avalanche">
                  <Menu.Item key="13">
                    <Link to="/flexusd/avalanche/pp">PP</Link>  
                  </Menu.Item>
                  <Menu.Item key="14">
                    <Link to="/flexusd/avalanche/stage">Stage</Link>
                  </Menu.Item>
                  <Menu.Item key="15">
                    <Link to="/flexusd/avalanche/prod">Prod</Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu key="sub9" title="Polygon">
                  <Menu.Item key="16">
                    <Link to="/flexusd/polygon/pp">PP</Link>
                  </Menu.Item>
                  <Menu.Item key="17">
                    <Link to="/flexusd/polygon/stage">Stage</Link>
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
                    <Link to="/flexusd/ftm/stage">Stage</Link>
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
                    <Link to="/flexusd/bsc/stage">Stage</Link>
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