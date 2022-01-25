import { getDailyPayoutPP, getVeFlexPP, getDailyDistributorPP, getFlexPP, getIncreaseStakePP, getMultiCallPP, getMultiCallFlexPP, getMultiCallVeFlexPP, getMultiCallDailyPayoutPP, getMultiCallDailyDistributorPP } from '../conn';
import { ConnectionContext} from '../App'
import { Payout } from '../components/contracts/Payout';
import { VeFLEX } from '../components/contracts/VeFLEX';
import { Distributor } from '../components/contracts/Distributor';
import { FLEX } from "../components/contracts/FLEX";
import { useEffect, useState, useContext } from "react";

import { errorHandle } from "../utils";

const initialDataForPage = async (multiCall, multiCallFlex, multiCallVeFlex, multiCallDailyPayout, multiCallDailyDistributorPP) => {
  try {
    const getFlexAdmin = multiCallFlex.owner();
    const getFlexTotalSupply = multiCallFlex.totalSupply();
  
    const getVeFlexAdmin = multiCallVeFlex.admin();
    const getVeFlexToken = multiCallVeFlex.token();
    const getVeFlexSupply = multiCallVeFlex.supply();
    const getVeFlexTotalSupply = multiCallVeFlex.totalSupply();

    const getDailyPayoutAdmin = multiCallDailyPayout.owner();
    const getDailyPayoutToken = multiCallDailyPayout.token();
    const getDailyPayoutVested = multiCallDailyPayout.vested();
    const getDailyPayoutEpochLen = multiCallDailyPayout.EPOCH_BLOCKS();
    const getDailyPayoutStartBlockHeight = multiCallDailyPayout.startBlockHeight();
    const getDailyPayoutActiveEpoch = multiCallDailyPayout.currentEpoch();

    const getDailyDistributorAdmin = multiCallDailyDistributorPP.admin();
    const getDailyDistributorName = multiCallDailyDistributorPP.name();
    const getDailyDistributorToken = multiCallDailyDistributorPP.flex();
    const getDailyDistributorPayout = multiCallDailyDistributorPP.payout();

    const [flexAdmin, 
      flexTotalSupply,
      veFlexAdmin,
      veFlexToken,
      veFlexSupply,
      veFlexTotalSupply,
      dailyPayoutAdmin,
      dailyPayoutToken,
      dailyPayoutVested,
      dailyPayoutEpochLen,
      dailyPayoutStartBlockHeight,
      dailyPayoutActiveEpoch,
      dailyDistributorAdmin,
      dailyDistributorName,
      dailyDistributorToken,
      dailyDistributorPayout
    ] = await multiCall.all([getFlexAdmin,
                          getFlexTotalSupply,
                          getVeFlexAdmin,
                          getVeFlexToken,
                          getVeFlexSupply,
                          getVeFlexTotalSupply,
                          getDailyPayoutAdmin,
                          getDailyPayoutToken,
                          getDailyPayoutVested,
                          getDailyPayoutEpochLen,
                          getDailyPayoutStartBlockHeight,
                          getDailyPayoutActiveEpoch,
                          getDailyDistributorAdmin,
                          getDailyDistributorName,
                          getDailyDistributorToken,
                          getDailyDistributorPayout
                        ]);
    return {
      flexAdmin, 
      flexTotalSupply,
      veFlexAdmin,
      veFlexToken,
      veFlexSupply,
      veFlexTotalSupply,
      dailyPayoutAdmin,
      dailyPayoutToken,
      dailyPayoutVested,
      dailyPayoutEpochLen,
      dailyPayoutStartBlockHeight,
      dailyPayoutActiveEpoch,
      dailyDistributorAdmin,
      dailyDistributorName,
      dailyDistributorToken,
      dailyDistributorPayout
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
          const _multiCallDailyPayout = getMultiCallDailyPayoutPP();
          const _multiCallDailyDistributor = getMultiCallDailyDistributorPP();
          if (_multiCall && _multiCallFlex && _multiCallVeFlex && _multiCallDailyPayout && _multiCallDailyDistributor) {
            const _initialData = await initialDataForPage(_multiCall, _multiCallFlex, _multiCallVeFlex, _multiCallDailyPayout, _multiCallDailyDistributor);
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
        <Payout payout={dailyPayout} conn={conn} flex={flex} initialData={initialData}></Payout>
        <Distributor distributor={distributor} flex={flex} initialData={initialData}></Distributor>
      </div>
    </>
  )
}