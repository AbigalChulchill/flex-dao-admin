import { getDailyPayoutStg1, getVeFlexStg1, getDailyDistributorStg1, getFlexStg1 } from '../conn';
import { PayoutStg1 } from '../components/contracts/PayoutStg1';
import { VeFLEX } from '../components/contracts/VeFLEX';
import { DistributorStg1 } from '../components/contracts/DistributorStg1';
import { FLEX } from "../components/contracts/FLEX";
import { useEffect, useState } from "react";

export const FlexDaoStg1Page = ({conn}) => {
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
        const _dailyPayout = getDailyPayoutStg1(conn);
        if (_dailyPayout) setDailyPayout(_dailyPayout);
        const _veFlex = getVeFlexStg1(conn);
        if (_veFlex) setVeFlex(_veFlex);
        const _distributor = getDailyDistributorStg1(conn);
        if (_distributor) setDistributor(_distributor);
        const _flex = getFlexStg1(conn);
        if (_flex) setFlex(_flex);
      }
    }
    fetchData();
  }, [conn]);

  return (
    <>
      <h1>FLEX DAO Stg1 Admin Page</h1>
      <div className="container">
        <FLEX flex={flex}></FLEX>
        <VeFLEX veflex={veFlex}></VeFLEX>
        <PayoutStg1 payout={dailyPayout}></PayoutStg1>
        <DistributorStg1 distributor={distributor}></DistributorStg1>
      </div>
    </>
  )
}