import * as config from '../config.json';
import { FlexUSDTpl } from "../components/templates/FlexUSDTpl";

export const FlexUSDSmartBCHStg = () => {
  return (
    <>
      <FlexUSDTpl config={config.flexusd.smartbch.stg} />
    </>
  )
}