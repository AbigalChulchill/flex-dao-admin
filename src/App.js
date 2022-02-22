import { Route, Switch, Redirect } from 'react-router-dom';
import { useEffect, useState, createContext } from 'react';

import { SideNav } from './components/layout/SideNav';
import { FlexPage } from './pages/FlexPage';
import { FlexUSDPage } from './pages/FlexUSDPage';
import { FlexDaoPage } from './pages/FlexDaoPage';
import { getConn } from './conn';
import { errorHandle } from "./utils";

export const ConnectionContext = createContext(null);

function App() {

  const [conn, setConn] = useState();

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

  return (
    <ConnectionContext.Provider value={{conn}}> 
      <div className='layout'>
        <SideNav />
        <div className="content">
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
        </div>
      </div>
    </ConnectionContext.Provider>
  );
}

export default App; 