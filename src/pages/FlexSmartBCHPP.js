import * as config from '../config.json';
import { FlexTpl } from "../components/templates/FlexTpl";

export const FlexSmartBCHPP = () => {
  return (
    <>
      <FlexTpl config={config.flex.smartbch.pp} />
    </>
  )
}