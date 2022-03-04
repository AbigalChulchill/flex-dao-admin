import * as config from '../config.json';
import { FlexUSDTpl } from "../components/templates/FlexUSDTpl";

export const FlexUSDETHPP = () => {
  return (
    <>
      <FlexUSDTpl config={config.flexusd.eth.pp} />
    </>
  )
}