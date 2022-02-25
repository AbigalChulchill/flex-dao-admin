import * as config from '../config.json';
import { FlexUSDTpl } from "../components/templates/FlexUSDTpl";

export const FlexUSDBSCPP = () => {
  return (
    <>
      <FlexUSDTpl config={config.flexusd.bsc.pp} />
    </>
  )
}