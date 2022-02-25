import * as config from '../config.json';
import { FlexUSDTpl } from "../components/templates/FlexUSDTpl";

export const FlexUSDAvaxPP = () => {
  return (
    <>
      <FlexUSDTpl config={config.flexusd.avax.pp} />
    </>
  )
}