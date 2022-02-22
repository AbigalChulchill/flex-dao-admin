import { Route, Switch, Redirect } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav'
import { FlexDaoPPPage } from './FlexDaoPPPage';
// import { FlexDaoStg1Page } from '../pages/FlexDaoStg1Page';
import { FlexDaoStg2Page } from './FlexDaoStg2Page';
// import { FlexDaoStg3Page } from '../pages/FlexDaoStg3Page';
import { FlexDaoProdPage } from './FlexDaoProdPage';

export const FlexDaoPage = () => {
  return (
    <>
      <TopNav category='FlexDaoPage'></TopNav>
      <div className='subContent'>
        <Switch>
          <Route path='/flex-dao' exact>
            <Redirect to='/flex-dao/prod' />
          </Route>
          <Route path='/flex-dao/pp'>
            <FlexDaoPPPage />
          </Route>
          {/* <Route path='/flex-dao/stg1'>
            <FlexDaoStg1Page />
          </Route> */}
          <Route path='/flex-dao/stg2'>
            <FlexDaoStg2Page />
          </Route>
          {/* <Route path='/flex-dao/stg3'>
            <FlexDaoStg3Page />
          </Route> */}
          <Route path='/flex-dao/prod'>
            <FlexDaoProdPage />
          </Route>
        </Switch>
      </div>
    </>
  )
}