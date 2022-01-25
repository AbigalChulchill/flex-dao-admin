import { getDailyPayoutPP, getVeFlexPP, getDailyDistributorPP, getFlexPP, getIncreaseStakePP, getMultiCallPP, getMultiCallFlexPP } from '../conn';
import { ConnectionContext} from '../App'
import { Payout } from '../components/contracts/Payout';
import { VeFLEX } from '../components/contracts/VeFLEX';
import { Distributor } from '../components/contracts/Distributor';
import { FLEX } from "../components/contracts/FLEX";
import { useEffect, useState, useContext } from "react";

import { errorHandle } from "../utils";

export const FlexDaoPPPage = () => {
  const { conn } = useContext(ConnectionContext);

  const [dailyPayout, setDailyPayout] = useState();
  const [veFlex, setVeFlex] = useState();
  const [distributor, setDistributor] = useState();
  const [flex, setFlex] = useState();
  const [increaseStake, setIncreaseStake] = useState();
  const [multiCall, setMultiCall] = useState();
  const [multiCallFlex, setMultiCallFlex] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
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
          const _increaseStake = getIncreaseStakePP(conn);
          if (_increaseStake) setIncreaseStake(_increaseStake);
          const _multiCall = await getMultiCallPP(conn);
          if (_multiCall) setMultiCall(_multiCall);
          const _multiCallFlex = getMultiCallFlexPP();
          if (_multiCallFlex) setMultiCallFlex(_multiCallFlex);
        }
      } catch (err) {
        errorHandle("initial FLEXDAO PP page", err);
      }
    }
    fetchData();
    return () => {
      setDailyPayout();
      setVeFlex();
      setDistributor();
      setFlex();
      setIncreaseStake();
      setMultiCall();
      setMultiCallFlex();
    }
  }, [conn]);

  return (
    <>
      <h1>FLEX DAO PP Admin Page</h1>
      <div className="container">
        <FLEX flex={flex} multiCall={multiCall} multiCallFlex={multiCallFlex}></FLEX>
        <VeFLEX veflex={veFlex}  flex={flex} conn={conn} increaseStake={increaseStake}></VeFLEX>
        <Payout payout={dailyPayout} conn={conn} flex={flex}></Payout>
        <Distributor distributor={distributor} flex={flex}></Distributor>
      </div>
    </>
  )
}