import { getDailyPayoutProd, getVeFlexProd, getDailyDistributorProd, getFlexProd, getIncreaseStakeProd, getMultiCallProd, getMultiCallFlexProd, getMultiCallVeFlexProd, getMultiCallDailyPayoutProd, getMultiCallDailyDistributorProd, getMultiCallIncreaseStakeProd } from '../conn';
import { ConnectionContext} from '../App'
import { Payout } from '../components/contracts/Payout';
import { VeFLEX } from '../components/contracts/VeFLEX';
import { Distributor } from '../components/contracts/Distributor';
import { FLEX } from "../components/contracts/FLEX";
import { useEffect, useState, useContext } from "react";
import * as config from '../config.json';

import { errorHandle } from "../utils";

const initialDataForPage = async (multiCall, multiCallFlex, multiCallVeFlex, multiCallDailyPayout, multiCallDailyDistributor, multiCallIncreaseStake) => {
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

    const getDailyDistributorAdmin = multiCallDailyDistributor.admin();
    const getDailyDistributorName = multiCallDailyDistributor.name();
    const getDailyDistributorToken = multiCallDailyDistributor.flex();
    const getDailyDistributorPayout = multiCallDailyDistributor.payout();

    const getIncreaseStakeAdmin = multiCallIncreaseStake.owner();
    const getIncreaseStakeVestingToken = multiCallIncreaseStake.vestingToken();
    const getIncreaseStakeToken = multiCallIncreaseStake.token();

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
      dailyDistributorPayout,
      increaseStakeAdmin,
      increaseStakeVestingToken,
      increaseStakeToken
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
                          getDailyDistributorPayout,
                          getIncreaseStakeAdmin,
                          getIncreaseStakeVestingToken,
                          getIncreaseStakeToken
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
      dailyDistributorPayout,
      increaseStakeAdmin,
      increaseStakeVestingToken,
      increaseStakeToken
    }
  } catch (err) {
    errorHandle('initialDataForPage', err);
  }
}
export const FlexDaoSmartBCHProd = () => {
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
          const _increaseStake = getIncreaseStakeProd(conn);
          if (_increaseStake) setIncreaseStake(_increaseStake);
          const _multiCall = await getMultiCallProd(conn);
          const _multiCallFlex = getMultiCallFlexProd();
          const _multiCallVeFlex = getMultiCallVeFlexProd();
          const _multiCallDailyPayout = getMultiCallDailyPayoutProd();
          const _multiCallDailyDistributor = getMultiCallDailyDistributorProd();
          const _multiCallIncreaseStake = getMultiCallIncreaseStakeProd();
          if (_multiCall && _multiCallFlex && _multiCallVeFlex && _multiCallDailyPayout && _multiCallDailyDistributor && _multiCallIncreaseStake) {
            const _initialData = await initialDataForPage(_multiCall, _multiCallFlex, _multiCallVeFlex, _multiCallDailyPayout, _multiCallDailyDistributor, _multiCallIncreaseStake);
            if (_initialData) setInitialData(_initialData);
          }
        }
      } catch (err) {
        errorHandle("initial FLEXDAO Prod page", err);
      }
    }
    fetchData();
    return () => {
      setDailyPayout();
      setVeFlex();
      setDistributor();
      setFlex();
      setIncreaseStake();
    }
  }, [conn]);

  return (
    <>
      <div className="container">
        <FLEX flex={flex} initialData={initialData}></FLEX>
        <VeFLEX veflex={veFlex} flex={flex} conn={conn} increaseStake={increaseStake} initialData={initialData}></VeFLEX>
        <Payout payout={dailyPayout} conn={conn} flex={flex} startTs={config.flex_dao_prod.payout_start_ts} initialData={initialData}></Payout>
        <Distributor distributor={distributor} flex={flex} initialData={initialData}></Distributor>
      </div>
    </>
  )
}