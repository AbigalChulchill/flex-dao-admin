import { Route, Switch, Redirect } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav'
import { FlexUSDPPPage } from './FlexUSDPPPage';

export const FlexUSDPage = () => {
  return (
    <>
      <TopNav category='FlexUSDPage'></TopNav>
      <div className='subContent'>
        <Switch>
          <Route path='/flexusd' exact>
            <Redirect to='/flexusd/pp' />
          </Route>
          <Route path='/flexusd/pp'>
            <FlexUSDPPPage />
          </Route>
        </Switch>
      </div>
    </>
 )
}