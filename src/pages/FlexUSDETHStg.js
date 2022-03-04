import * as config from '../config.json';
import { FlexUSDTpl } from "../components/templates/FlexUSDTpl";

export const FlexUSDETHStg = () => {
  return (
    <>
      <FlexUSDTpl config={config.flexusd.eth.stg} />
    </>
  )
}