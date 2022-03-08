import * as config from '../config.json';
import { FlexUSDTpl } from "../components/templates/FlexUSDTpl";

export const FlexUSDSmartBCHPP = () => {
  return (
    <>
      <FlexUSDTpl config={config.flexusd.smartbch.pp} />
    </>
  )
}