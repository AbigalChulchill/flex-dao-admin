import { Route, Switch } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav'
import { FlexDaoPPPage } from '../pages/FlexDaoPPPage';
import { FlexDaoStg1Page } from '../pages/FlexDaoStg1Page';
import { FlexDaoStg2Page } from '../pages/FlexDaoStg2Page';
import { FlexDaoStg3Page } from '../pages/FlexDaoStg3Page';
import { FlexDaoProdPage } from '../pages/FlexDaoProdPage';

export const FlexDaoPage = ({conn}) => {
  return (
    <>
      <TopNav category='FlexDaoPage'></TopNav>
      <div className='subContent'>
        <Switch>
          <Route path='/flex-dao/pp'>
            <FlexDaoPPPage conn={conn}/>
          </Route>
          <Route path='/flex-dao/stg1'>
            <FlexDaoStg1Page conn={conn}/>
          </Route>
          <Route path='/flex-dao/stg2'>
            <FlexDaoStg2Page conn={conn}/>
          </Route>
          <Route path='/flex-dao/stg3'>
            <FlexDaoStg3Page conn={conn}/>
          </Route>
          <Route path='/flex-dao/prod'>
            <FlexDaoProdPage conn={conn}/>
          </Route>
        </Switch>
      </div>
    </>
  )
}