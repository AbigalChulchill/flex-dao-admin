import * as config from '../config.json';
import { FlexDaoTpl } from "../components/templates/FlexDaoTpl";

export const FlexDaoSmartBCHStg = () => {
  return (
    <>
      <FlexDaoTpl config={config.flexdao.smartbch.stg} />
    </>
  )
}