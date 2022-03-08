import * as config from '../config.json';
import { FlexUSDTpl } from "../components/templates/FlexUSDTpl";

export const FlexUSDSmartBCHProd = () => {
  return (
    <>
      <FlexUSDTpl config={config.flexusd.smartbch.prod} />
    </>
  )
}