import { getDailyPayoutStg3, getVeFlexStg3, getDailyDistributorStg3, getFlexStg3 } from '../conn';
import { Payout } from '../components/contracts/Payout';
import { VeFLEX } from '../components/contracts/VeFLEX';
import { Distributor } from '../components/contracts/Distributor';
import { FLEX } from "../components/contracts/FLEX";
import { useEffect, useState } from "react";

export const FlexDaoStg3Page = ({conn}) => {
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
        window.location.reload(false);
      }
      if (conn && ethereum.networkVersion === '10000') {
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
        <VeFLEX veflex={veFlex}></VeFLEX>
        <Payout payout={dailyPayout} conn={conn}></Payout>
        <Distributor distributor={distributor}></Distributor>
      </div>
    </>
  )
}