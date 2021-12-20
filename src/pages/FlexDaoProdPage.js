import { getDailyPayoutProd, getVeFlexProd, getDailyDistributorProd, getFlexProd } from '../conn';
import { ConnectionContext} from '../App'
import { Payout } from '../components/contracts/Payout';
import { VeFLEX } from '../components/contracts/VeFLEX';
import { Distributor } from '../components/contracts/Distributor';
import { FLEX } from "../components/contracts/FLEX";
import { useEffect, useState, useContext } from "react";
import * as config from '../config.json';

export const FlexDaoProdPage = () => {
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
        const _dailyPayout = getDailyPayoutProd(conn);
        if (_dailyPayout) setDailyPayout(_dailyPayout);
        const _veFlex = getVeFlexProd(conn);
        if (_veFlex) setVeFlex(_veFlex);
        const _distributor = getDailyDistributorProd(conn);
        if (_distributor) setDistributor(_distributor);
        const _flex = getFlexProd(conn);
        if (_flex) setFlex(_flex);
      }
    }
    fetchData();
  }, [conn]);

  return (
    <>
      <h1>FLEX DAO Prod Admin Page</h1>
      <div className="container">
        <FLEX flex={flex}></FLEX>
        <VeFLEX veflex={veFlex}></VeFLEX>
        <Payout payout={dailyPayout} conn={conn} flex={flex} startTs={config.flex_dao_prod.payout_start_ts}></Payout>
        <Distributor distributor={distributor} flex={flex}></Distributor>
      </div>
    </>
  )
}