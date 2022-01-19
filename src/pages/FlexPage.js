import { Route, Switch, Redirect } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav'
import { FlexPPPage } from '../pages/FlexPPPage';
import { FlexStg2Page } from '../pages/FlexStg2Page';
import { FlexProdPage } from '../pages/FlexProdPage';

export const FlexPage = () => {
  return (
    <>
      <TopNav category='FlexPage'></TopNav>
      <div className='subContent'>
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