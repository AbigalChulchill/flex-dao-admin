import { Route, Switch, Redirect } from 'react-router-dom';
import { FlexUSDPPPage } from './FlexUSDPPPage';

export const FlexUSDPage = () => {
  return (
    <>
      <div>
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
