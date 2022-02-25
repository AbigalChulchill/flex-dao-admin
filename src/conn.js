import { ethers, Contract } from 'ethers';
import * as flex from './contracts/FLEXCoin.json'
import * as veFlex from './contracts/veFLEX.json'
import * as dailyPayout from './contracts/DailyPayout.json'
import * as dailyPayoutStg1 from './contracts/DailyPayoutStg1.json'
import * as distributor from './contracts/Distributor.json'
import * as DistributorStg1 from './contracts/DistributorStg1.json'
import * as increaseStake from './contracts/IncreaseStake.json'
import * as transferToken from './contracts/TransferToken.json'
import * as flexUSD from './contracts/FlexUSDImplV2.json'
import * as config from './config.json'
import { Provider as MultiCallProvider, Contract as MultiCallContract, setMulticallAddress } from 'ethers-multicall';

export const getConn = () => {
  return new Promise((resolve, _) => {
    window.addEventListener('load', async () => {
      if (window && window.ethereum) {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        return resolve(provider);
      }
    });
  });
}


export const getFlexPP = ( conn ) => {
  return new Contract(config.flex_dao_pp.flex, flex.abi, conn.getSigner());
}
export const getVeFlexPP = ( conn ) => {
  return new Contract(config.flex_dao_pp.veFLEX, veFlex.abi, conn.getSigner());
}
export const getDailyPayoutPP = ( conn ) => {
  return new Contract(config.flex_dao_pp.daily_payout, dailyPayout.abi, conn.getSigner());
}
export const getDailyDistributorPP = ( conn ) => {
  return new Contract(config.flex_dao_pp.daily_mini_distributor, distributor.abi, conn.getSigner())
}
export const getIncreaseStakePP = ( conn ) => {
  return new Contract(config.flex_dao_pp.increase_stake, increaseStake.abi, conn.getSigner())
}
export const getTransferTokenPP = ( conn ) => {
  return new Contract(config.flex_dao_pp.transfer_token, transferToken.abi, conn.getSigner())
}
export const getMultiCallPP = async ( conn ) => {
  setMulticallAddress(10001, config.flex_dao_pp.multi_call);
  const callProvider = new MultiCallProvider(conn, 10001);
  return callProvider;
}
export const getMultiCallFlexPP = () => {
  return new MultiCallContract(config.flex_dao_pp.flex, flex.abi);
}
export const getMultiCallVeFlexPP = () => {
  return new MultiCallContract(config.flex_dao_pp.veFLEX, veFlex.abi);
}
export const getMultiCallDailyPayoutPP = () => {
  return new MultiCallContract(config.flex_dao_pp.daily_payout, dailyPayout.abi);
}
export const getMultiCallDailyDistributorPP = () => {
  return new MultiCallContract(config.flex_dao_pp.daily_mini_distributor, distributor.abi);
}
export const getMultiCallIncreaseStakePP = () => {
  return new MultiCallContract(config.flex_dao_pp.increase_stake, increaseStake.abi);
}
export const getMultiCallTransferTokenPP = () => {
  return new MultiCallContract(config.flex_dao_pp.transfer_token, transferToken.abi);
}


export const getFlexStg1 = ( conn ) => {
  return new Contract(config.flex_dao_stg1.flex, flex.abi, conn.getSigner());
}
export const getVeFlexStg1 = ( conn ) => {
  return new Contract(config.flex_dao_stg1.veFLEX, veFlex.abi, conn.getSigner());
}
export const getDailyPayoutStg1 = ( conn ) => {
  return new Contract(config.flex_dao_stg1.daily_payout, dailyPayoutStg1.abi, conn.getSigner());
}
export const getDailyDistributorStg1 = ( conn ) => {
  return new Contract(config.flex_dao_stg1.daily_mini_distributor, DistributorStg1.abi, conn.getSigner())
}



export const getFlexStg2 = ( conn ) => {
  return new Contract(config.flex_dao_stg2.flex, flex.abi, conn.getSigner());
}
export const getVeFlexStg2 = ( conn ) => {
  return new Contract(config.flex_dao_stg2.veFLEX, veFlex.abi, conn.getSigner());
}
export const getDailyPayoutStg2 = ( conn ) => {
  return new Contract(config.flex_dao_stg2.daily_payout, dailyPayout.abi, conn.getSigner());
}
export const getDailyDistributorStg2 = ( conn ) => {
  return new Contract(config.flex_dao_stg2.daily_mini_distributor, distributor.abi, conn.getSigner())
}
export const getIncreaseStakeStg2 = ( conn ) => {
  return new Contract(config.flex_dao_stg2.increase_stake, increaseStake.abi, conn.getSigner())
}
export const getTransferTokenStg2 = ( conn ) => {
  return new Contract(config.flex_dao_stg2.transfer_token, transferToken.abi, conn.getSigner())
}
export const getMultiCallStg2 = async ( conn ) => {
  setMulticallAddress(10000, config.flex_dao_stg2.multi_call);
  const callProvider = new MultiCallProvider(conn, 10000);
  return callProvider;
}
export const getMultiCallFlexStg2 = () => {
  return new MultiCallContract(config.flex_dao_stg2.flex, flex.abi);
}
export const getMultiCallVeFlexStg2 = () => {
  return new MultiCallContract(config.flex_dao_stg2.veFLEX, veFlex.abi);
}
export const getMultiCallDailyPayoutStg2 = () => {
  return new MultiCallContract(config.flex_dao_stg2.daily_payout, dailyPayout.abi);
}
export const getMultiCallDailyDistributorStg2 = () => {
  return new MultiCallContract(config.flex_dao_stg2.daily_mini_distributor, distributor.abi);
}
export const getMultiCallIncreaseStakeStg2 = () => {
  return new MultiCallContract(config.flex_dao_stg2.increase_stake, increaseStake.abi);
}
export const getMultiCallTransferTokenStg2 = () => {
  return new MultiCallContract(config.flex_dao_stg2.transfer_token, transferToken.abi);
}


export const getFlexStg3 = ( conn ) => {
  return new Contract(config.flex_dao_stg3.flex, flex.abi, conn.getSigner());
}
export const getVeFlexStg3 = ( conn ) => {
  return new Contract(config.flex_dao_stg3.veFLEX, veFlex.abi, conn.getSigner());
}
export const getDailyPayoutStg3 = ( conn ) => {
  return new Contract(config.flex_dao_stg3.daily_payout, dailyPayout.abi, conn.getSigner());
}
export const getDailyDistributorStg3 = ( conn ) => {
  return new Contract(config.flex_dao_stg3.daily_mini_distributor, distributor.abi, conn.getSigner())
}


export const getFlexProd = ( conn ) => {
  return new Contract(config.flex_dao_prod.flex, flex.abi, conn.getSigner());
}
export const getVeFlexProd = ( conn ) => {
  return new Contract(config.flex_dao_prod.veFLEX, veFlex.abi, conn.getSigner());
}
export const getDailyPayoutProd = ( conn ) => {
  return new Contract(config.flex_dao_prod.daily_payout, dailyPayout.abi, conn.getSigner());
}
export const getDailyDistributorProd = ( conn ) => {
  return new Contract(config.flex_dao_prod.daily_mini_distributor, distributor.abi, conn.getSigner())
}
export const getIncreaseStakeProd = ( conn ) => {
  return new Contract(config.flex_dao_prod.increase_stake, increaseStake.abi, conn.getSigner())
}
export const getTransferTokenProd = ( conn ) => {
  return new Contract(config.flex_dao_prod.transfer_token, transferToken.abi, conn.getSigner())
}
export const getMultiCallProd = async ( conn ) => {
  setMulticallAddress(10000, config.flex_dao_prod.multi_call);
  const callProvider = new MultiCallProvider(conn, 10000);
  return callProvider;
}
export const getMultiCallFlexProd = () => {
  return new MultiCallContract(config.flex_dao_prod.flex, flex.abi);
}
export const getMultiCallVeFlexProd = () => {
  return new MultiCallContract(config.flex_dao_prod.veFLEX, veFlex.abi);
}
export const getMultiCallDailyPayoutProd = () => {
  return new MultiCallContract(config.flex_dao_prod.daily_payout, dailyPayout.abi);
}
export const getMultiCallDailyDistributorProd = () => {
  return new MultiCallContract(config.flex_dao_prod.daily_mini_distributor, distributor.abi);
}
export const getMultiCallIncreaseStakeProd = () => {
  return new MultiCallContract(config.flex_dao_prod.increase_stake, increaseStake.abi);
}
export const getMultiCallTransferTokenProd = () => {
  return new MultiCallContract(config.flex_dao_prod.transfer_token, transferToken.abi);
}

export const getFlexUSDAvaxPP = ( conn ) => {
  return new Contract(config.flexusd.avax.pp.flexusd, flexUSD.abi, conn.getSigner());
}
export const getMultiCallAvaxPP = async ( conn ) => {
  setMulticallAddress(config.flexusd.avax.pp.chain_id, config.flexusd.avax.pp.multi_call);
  const callProvider = new MultiCallProvider(conn, config.flexusd.avax.pp.chain_id);
  return callProvider;
}
export const getMultiCallFlexUSDAvaxPP = () => {
  return new MultiCallContract(config.flexusd.avax.pp.flexusd, flexUSD.abi);
}