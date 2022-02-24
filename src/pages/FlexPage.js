import { Route, Switch, Redirect } from 'react-router-dom';
import { FlexPPPage } from './FlexPPPage';
import { FlexStg2Page } from './FlexStg2Page';
import { FlexProdPage } from './FlexProdPage';

export const FlexPage = () => {
  return (
    <>
      <div>
        <Switch>
          <Route path='/flex' exact>
            <Redirect to='/flex/prod' />
          </Route>
          <Route path='/flex/pp'>
            <FlexPPPage />
          </Route>
          <Route path='/flex/stg2'>
            <FlexStg2Page />
          </Route>
          <Route path='/flex/prod'>
            <FlexProdPage />
          </Route>
        </Switch>
      </div>
    </>
  )
}