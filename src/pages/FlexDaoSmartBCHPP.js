import * as config from '../config.json';
import { FlexDaoTpl } from "../components/templates/FlexDaoTpl";

export const FlexDaoSmartBCHPP = () => {
  return (
    <>
      <FlexDaoTpl config={config.flexdao.smartbch.pp} />
    </>
  )
}