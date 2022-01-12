import { getDailyPayoutStg3, getVeFlexStg3, getDailyDistributorStg3, getFlexStg3 } from '../conn';
import { ConnectionContext} from '../App'
import { Payout } from '../components/contracts/Payout';
import { VeFLEX } from '../components/contracts/VeFLEX';
import { Distributor } from '../components/contracts/Distributor';
import { FLEX } from "../components/contracts/FLEX";
import { useEffect, useState, useContext } from "react";
import * as config from '../config.json';

export const FlexDaoStg3Page = () => {
  const { conn } = useContext(ConnectionContext);
  
  const [dailyPayout, setDailyPayout] = useState();
  const [veFlex, setVeFlex] = useState();
  const [distributor, setDistributor] = useState();
  const [flex, setFlex] = useState();

  useEffect(() => {
    async function fetchData() {
      const ethereum = window.ethereum;
      if (ethereum.networkVersion !== '10000') {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: '0x2710' }],
        });
      }
      if (conn) {
        const _dailyPayout = getDailyPayoutStg3(conn);
        if (_dailyPayout) setDailyPayout(_dailyPayout);
        const _veFlex = getVeFlexStg3(conn);
        if (_veFlex) setVeFlex(_veFlex);
        const _distributor = getDailyDistributorStg3(conn);
        if (_distributor) setDistributor(_distributor);
        const _flex = getFlexStg3(conn);
        if (_flex) setFlex(_flex);
      }
    }
    fetchData();
  }, [conn]);

  return (
    <>
      <h1>FLEX DAO Stg3 Admin Page</h1>
      <div className="container">
        <FLEX flex={flex}></FLEX>
        <VeFLEX veflex={veFlex} flex={flex} conn={conn}></VeFLEX>
        <Payout payout={dailyPayout} conn={conn} flex={flex} startTs={config.flex_dao_stg3.payout_start_ts}></Payout>
        <Distributor distributor={distributor} flex={flex}></Distributor>
      </div>
    </>
  )
}