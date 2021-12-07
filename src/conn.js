import { ethers, Contract } from 'ethers';
import * as flex from './contracts/FLEXCoin.json'
import * as veFlex from './contracts/veFLEX.json'
import * as dailyPayout from './contracts/DailyPayout.json'
import * as distributor from './contracts/Distributor.json'
import * as config from './config.json'

export const getConn = () => {
  return new Promise((resolve, _) => {
    window.addEventListener('load', async () => {
      if (window && window.ethereum) {
        await window.ethereum.enable();
        const proveder = new ethers.providers.Web3Provider(window.ethereum);
        const signer = proveder.getSigner();
        return resolve(signer);
      }
    });
  });
}


export const getFlexPP = ( conn ) => {
  return new Contract(config.flex_dao_pp.flex, flex.abi, conn);
}

export const getVeFlexPP = ( conn ) => {
  return new Contract(config.flex_dao_pp.veFLEX, veFlex.abi, conn);
}

export const getDailyPayoutPP = ( conn ) => {
  return new Contract(config.flex_dao_pp.daily_payout, dailyPayout.abi, conn);
}

export const getDailyDistributorPP = ( conn ) => {
  return new Contract(config.flex_dao_pp.daily_mini_distributor, distributor.abi, conn)
}


export const getFlexStg2 = ( conn ) => {
  return new Contract(config.flex_dao_stg2.flex, flex.abi, conn);
}

export const getVeFlexStg2 = ( conn ) => {
  return new Contract(config.flex_dao_stg2.veFLEX, veFlex.abi, conn);
}

export const getDailyPayoutStg2 = ( conn ) => {
  return new Contract(config.flex_dao_stg2.daily_payout, dailyPayout.abi, conn);
}

export const getDailyDistributorStg2 = ( conn ) => {
  return new Contract(config.flex_dao_stg2.daily_mini_distributor, distributor.abi, conn)
}


export const getFlexStg3 = ( conn ) => {
  return new Contract(config.flex_dao_stg3.flex, flex.abi, conn);
}
export const getVeFlexStg3 = ( conn ) => {
  return new Contract(config.flex_dao_stg3.veFLEX, veFlex.abi, conn);
}
export const getDailyPayoutStg3 = ( conn ) => {
  return new Contract(config.flex_dao_stg3.daily_payout, dailyPayout.abi, conn);
}
export const getDailyDistributorStg3 = ( conn ) => {
  return new Contract(config.flex_dao_stg3.daily_mini_distributor, distributor.abi, conn)
}