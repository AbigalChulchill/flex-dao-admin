import { ethers, Contract } from 'ethers';
import * as flex from './contracts/FLEXCoin.json'
import * as veFlex from './contracts/veFLEX.json'
import * as dailyPayout from './contracts/DailyPayout.json'
import * as dailyPayoutStg1 from './contracts/DailyPayoutStg1.json'
import * as distributor from './contracts/Distributor.json'
import * as DistributorStg1 from './contracts/DistributorStg1.json'
import * as config from './config.json'

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