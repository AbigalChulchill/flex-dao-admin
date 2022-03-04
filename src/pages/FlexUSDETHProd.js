import * as config from '../config.json';
import { FlexUSDTpl } from "../components/templates/FlexUSDTpl";

export const FlexUSDETHProd = () => {
  return (
    <>
      <FlexUSDTpl config={config.flexusd.eth.prod} />
    </>
  )
}