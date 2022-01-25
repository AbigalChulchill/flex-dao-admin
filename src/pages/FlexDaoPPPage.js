import { getDailyPayoutPP, getVeFlexPP, getDailyDistributorPP, getFlexPP, getIncreaseStakePP, getMultiCallPP, getMultiCallFlexPP, getMultiCallVeFlexPP } from '../conn';
import { ConnectionContext} from '../App'
import { Payout } from '../components/contracts/Payout';
import { VeFLEX } from '../components/contracts/VeFLEX';
import { Distributor } from '../components/contracts/Distributor';
import { FLEX } from "../components/contracts/FLEX";
import { useEffect, useState, useContext } from "react";

import { errorHandle } from "../utils";

const initialDataForPage = async (multiCall, multiCallFlex, multiCallVeFlex) => {
  try {
    const getFlexAdmin = multiCallFlex.owner();
    const getFlexTotalSupply = multiCallFlex.totalSupply();
  
    const getVeFlexAdmin = multiCallVeFlex.admin();
    const getVeFlexToken = multiCallVeFlex.token();
    const getVeFlexSupply = multiCallVeFlex.supply();
    const getVeFlexTotalSupply = multiCallVeFlex.totalSupply();
  
    const [_flexAdmin, 
      _flexTotalSupply,
      _veFlexAdmin,
      _veFlexToken,
      _veFlexSupply,
      _veFlexTotalSupply
    ] = await multiCall.all([getFlexAdmin,
                          getFlexTotalSupply,
                          getVeFlexAdmin,
                          getVeFlexToken,
                          getVeFlexSupply,
                          getVeFlexTotalSupply
                        ]);
    return {
      flexAdmin: _flexAdmin,
      flexTotalSupply: _flexTotalSupply,
      veFlexAdmin: _veFlexAdmin, 
      veFlexToken: _veFlexToken,
      veFlexSupply: _veFlexSupply,
      veFlexTotalSupply: _veFlexTotalSupply
    }
  } catch (err) {
    errorHandle('initialDataForPage', err);
  }
}

export const FlexDaoPPPage = () => {
  const { conn } = useContext(ConnectionContext);

  const [dailyPayout, setDailyPayout] = useState();
  const [veFlex, setVeFlex] = useState();
  const [distributor, setDistributor] = useState();
  const [flex, setFlex] = useState();
  const [increaseStake, setIncreaseStake] = useState();
  const [initialData, setInitialData] = useState();

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
          const _multiCallFlex = getMultiCallFlexPP();
          const _multiCallVeFlex = getMultiCallVeFlexPP();
          if (_multiCall && _multiCallFlex && _multiCallVeFlex) {
            const _initialData = await initialDataForPage(_multiCall, _multiCallFlex, _multiCallVeFlex);
            if (_initialData) setInitialData(_initialData);
          }
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
      setInitialData();
    }
  }, [conn]);

  return (
    <>
      <h1>FLEX DAO PP Admin Page</h1>
      <div className="container">
        <FLEX flex={flex} initialData={initialData}></FLEX>
        <VeFLEX veflex={veFlex}  flex={flex} conn={conn} increaseStake={increaseStake} initialData={initialData}></VeFLEX>
        <Payout payout={dailyPayout} conn={conn} flex={flex}></Payout>
        <Distributor distributor={distributor} flex={flex}></Distributor>
      </div>
    </>
  )
}