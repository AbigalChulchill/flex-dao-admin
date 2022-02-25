import * as config from '../config.json';
import { FlexDaoTpl } from "../components/templates/FlexDaoTpl";

export const FlexDaoSmartBCHProd = () => {
  return (
    <>
      <FlexDaoTpl config={config.flexdao.smartbch.prod} />
    </>
  )
}