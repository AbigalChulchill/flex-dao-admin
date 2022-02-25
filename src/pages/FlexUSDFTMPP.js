import * as config from '../config.json';
import { FlexUSDTpl } from "../components/templates/FlexUSDTpl";

export const FlexUSDFTMPP = () => {
  return (
    <>
      <FlexUSDTpl config={config.flexusd.ftm.pp} />
    </>
  )
}