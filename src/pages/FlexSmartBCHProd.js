import * as config from '../config.json';
import { FlexTpl } from "../components/templates/FlexTpl";

export const FlexSmartBCHProd = () => {
  return (
    <>
      <FlexTpl config={config.flex.smartbch.prod} />
    </>
  )
}