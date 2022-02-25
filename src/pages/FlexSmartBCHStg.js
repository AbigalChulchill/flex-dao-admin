import * as config from '../config.json';
import { FlexTpl } from "../components/templates/FlexTpl";

export const FlexSmartBCHStg = () => {
  return (
    <>
      <FlexTpl config={config.flex.smartbch.stg} />
    </>
  )
}