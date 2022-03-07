import { useEffect, useState, useContext } from "react";
import { Contract } from 'ethers';
import { Provider as MultiCallProvider, Contract as MultiCallContract, setMulticallAddress } from 'ethers-multicall';

import { GlobalContext} from '../../App';

import { Payout } from '../contracts/Payout';
import { VeFLEX } from '../contracts/VeFLEX';
import { Distributor } from '../contracts/Distributor';
import { FLEX } from "../contracts/FLEX";

import * as FlexABI from '../../contracts/FLEXCoin.json'
import * as VeFlexABI from '../../contracts/veFLEX.json'
import * as DailyPayoutABI from '../../contracts/DailyPayout.json'
import * as DistributorABI from '../../contracts/Distributor.json'
import * as IncreaseStakeABI from '../../contracts/IncreaseStake.json'

import { errorHandle } from "../../utils";

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
    errorHandle('flexdao initialDataForPage', err);
  }
}

const getDailyPayout = (config, conn) => {
  return new Contract(config.daily_payout, DailyPayoutABI.abi, conn.getSigner());
}

const getVeFlex = (config, conn) => {
  return new Contract(config.veFlex, VeFlexABI.abi, conn.getSigner());
}

const getDailyDistributor = (config, conn) => {
  return new Contract(config.daily_mini_distributor, DistributorABI.abi, conn.getSigner());
}

const getFlex = (config, conn) => {
  return new Contract(config.flex, FlexABI.abi, conn.getSigner());
}

const getIncreaseStake = (config, conn) => {
  return new Contract(config.increase_stake, IncreaseStakeABI.abi, conn.getSigner());
}

const getMultiCall = async (config, conn) => {
  setMulticallAddress(config.chain_id, config.multi_call);
  const callProvider = new MultiCallProvider(conn, config.chain_id);
  return callProvider;
}

const getMultiCallFlex = (config) => {
  return new MultiCallContract(config.flex, FlexABI.abi);
}

const getMultiCallVeFlex = (config) => {
  return new MultiCallContract(config.veFlex, VeFlexABI.abi);
}

const getMultiCallDailyPayout = (config) => {
  return new MultiCallContract(config.daily_payout, DailyPayoutABI.abi);
}

const getMultiCallDailyDistributor = (config) => {
  return new MultiCallContract(config.daily_mini_distributor, DistributorABI.abi);
}

const getMultiCallIncreaseStake = (config) => {
  return new MultiCallContract(config.increase_stake, IncreaseStakeABI.abi);
}

export const FlexDaoTpl = ( {config}) => {
  const { conn } = useContext(GlobalContext);

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
        if (ethereum.networkVersion !== config.chain_id) {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x" + Number(config.chain_id).toString(16) }],
          });
        }
        if (conn && config) {
          const _dailyPayout = getDailyPayout(config, conn);
          if (_dailyPayout) setDailyPayout(_dailyPayout);

          const _veFlex = getVeFlex(config, conn);
          if (_veFlex) setVeFlex(_veFlex);

          const _distributor = getDailyDistributor(config, conn);
          if (_distributor) setDistributor(_distributor);

          const _flex = getFlex(config, conn);
          if (_flex) setFlex(_flex);

          const _increaseStake = getIncreaseStake(config, conn);
          if (_increaseStake) setIncreaseStake(_increaseStake);

          const _multiCall = await getMultiCall(config, conn);
          const _multiCallFlex = getMultiCallFlex(config);
          const _multiCallVeFlex = getMultiCallVeFlex(config);
          const _multiCallDailyPayout = getMultiCallDailyPayout(config);
          const _multiCallDailyDistributor = getMultiCallDailyDistributor(config);
          const _multiCallIncreaseStake = getMultiCallIncreaseStake(config);
          if (_multiCall && _multiCallFlex && _multiCallVeFlex && _multiCallDailyPayout && _multiCallDailyDistributor && _multiCallIncreaseStake) {
            const _initialData = await initialDataForPage(_multiCall, _multiCallFlex, _multiCallVeFlex, _multiCallDailyPayout, _multiCallDailyDistributor, _multiCallIncreaseStake);
            if (_initialData) setInitialData(_initialData);
          }
        }
      } catch (err) {
        errorHandle(`initial ${config.name} page`, err);
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
  }, [config, conn]);

  return (
    <>
      <h1>{config.name} @ {config.network_name}</h1>
      <div className="container">
        <FLEX flex={flex} initialData={initialData} config={config}></FLEX>
        <VeFLEX veflex={veFlex}  flex={flex} conn={conn} increaseStake={increaseStake} initialData={initialData} config={config}></VeFLEX>
        <Payout payout={dailyPayout} conn={conn} flex={flex} initialData={initialData} config={config}></Payout>
        <Distributor distributor={distributor} flex={flex} initialData={initialData} config={config}></Distributor>
      </div>
    </>
  )
}