import * as config from '../config.json';
import { FlexUSDTpl } from "../components/templates/FlexUSDTpl";

export const FlexUSDPolygonPP = () => {
  return (
    <>
      <FlexUSDTpl config={config.flexusd.polygon.pp} />
    </>
  )
}