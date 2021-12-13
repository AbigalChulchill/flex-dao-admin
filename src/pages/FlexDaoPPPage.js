import { getDailyPayoutPP, getVeFlexPP, getDailyDistributorPP, getFlexPP } from '../conn';
import { ConnectionContext} from '../App'
import { Payout } from '../components/contracts/Payout';
import { VeFLEX } from '../components/contracts/VeFLEX';
import { Distributor } from '../components/contracts/Distributor';
import { FLEX } from "../components/contracts/FLEX";
import { useEffect, useState, useContext } from "react";

export const FlexDaoPPPage = () => {
  const { conn } = useContext(ConnectionContext);

  const [dailyPayout, setDailyPayout] = useState();
  const [veFlex, setVeFlex] = useState();
  const [distributor, setDistributor] = useState();
  const [flex, setFlex] = useState();

  useEffect(() => {
    async function fetchData() {
      const ethereum = window.ethereum;
      if (ethereum.networkVersion !== '10001') {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: '0x2711' }],
        });
      }
      if (conn) {
        const _dailyPayout = getDailyPayoutPP(conn);
        if (_dailyPayout) setDailyPayout(_dailyPayout);
        const _veFlex = getVeFlexPP(conn);
        if (_veFlex) setVeFlex(_veFlex);
        const _distributor = getDailyDistributorPP(conn);
        if (_distributor) setDistributor(_distributor);
        const _flex = getFlexPP(conn);
        if (_flex) setFlex(_flex);
      }
    }
    fetchData();
  }, [conn]);

  return (
    <>
      <h1>FLEX DAO PP Admin Page</h1>
      <div className="container">
        <FLEX flex={flex}></FLEX>
        <VeFLEX veflex={veFlex}></VeFLEX>
        <Payout payout={dailyPayout} conn={conn}></Payout>
        <Distributor distributor={distributor} flex={flex}></Distributor>
      </div>
    </>
  )
}