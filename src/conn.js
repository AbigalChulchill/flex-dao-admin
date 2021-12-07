import { ethers, Contract } from 'ethers';
import * as flex from './contracts/FLEXCoin.json'
import * as veFlex from './contracts/veFLEX.json'
import * as dailyPayout from './contracts/DailyPayout.json'
import * as distributor from './contracts/Distributor.json'
import * as config from './config.json'
import { errorHandle } from './utils';

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
  if (window.ethereum.networkVersion === '10001') {
    return new Contract(config.flex_dao_pp.flex, flex.abi, conn);
  } else {
    errorHandle('getFlexPP', 'metamask is not in smartbch testnet');
    return undefined;
  }
}

export const getVeFlexPP = ( conn ) => {
  if (window.ethereum.networkVersion === '10001') {
    return new Contract(config.flex_dao_pp.veFLEX, veFlex.abi, conn);
  } else {
    errorHandle('getVeFlexPP', 'metamask is not in smartbch testnet');
    return undefined;
  }
}

export const getDailyPayoutPP = ( conn ) => {
  if (window.ethereum.networkVersion === '10001') {
    return new Contract(config.flex_dao_pp.daily_payout, dailyPayout.abi, conn);
  } else {
    errorHandle('getDailyPayoutPP', 'metamask is not in smartbch testnet');
    return undefined;
  }
}

export const getDailyDistributorPP = ( conn ) => {
  if (window.ethereum.networkVersion === '10001') {
    return new Contract(config.flex_dao_pp.daily_mini_distributor, distributor.abi, conn)
  } else {
    errorHandle('getDistributorPP', 'metamask is not in smartbch testnet');
    return undefined;
  }
}


export const getFlexStg2 = ( conn ) => {
  if (window.ethereum.networkVersion === '10000') {
    return new Contract(config.flex_dao_stg2.flex, flex.abi, conn);
  } else {
    errorHandle('getFlexStg2', 'metamask is not in smartbch mainnet');
    return undefined;
  }
}
export const getVeFlexStg2 = ( conn ) => {
  if (window.ethereum.networkVersion === '10000') {
    return new Contract(config.flex_dao_stg2.veFLEX, veFlex.abi, conn);
  } else {
    errorHandle('getVeFlexStg2', 'metamask is not in smartbch mainnet');
    return undefined;
  }
}
export const getDailyPayoutStg2 = ( conn ) => {
  if (window.ethereum.networkVersion === '10000') {
    return new Contract(config.flex_dao_stg2.daily_payout, dailyPayout.abi, conn);
  } else {
    errorHandle('getDailyPayoutStg2', 'metamask is not in smartbch mainnet');
    return undefined;
  }
}
export const getDailyDistributorStg2 = ( conn ) => {
  if (window.ethereum.networkVersion === '10000') {
    return new Contract(config.flex_dao_stg2.daily_mini_distributor, distributor.abi, conn)
  } else {
    errorHandle('getDailyDistributorStg2', 'metamask is not in smartbch mainnet');
    return undefined;
  }
}


export const getFlexStg3 = ( conn ) => {
  if (window.ethereum.networkVersion === '10000') {
    return new Contract(config.flex_dao_stg3.flex, flex.abi, conn);
  } else {
    errorHandle('getFlexStg3', 'metamask is not in smartbch mainnet');
    return undefined;
  }
}
export const getVeFlexStg3 = ( conn ) => {
  if (window.ethereum.networkVersion === '10000') {
    return new Contract(config.flex_dao_stg3.veFLEX, veFlex.abi, conn);
  } else {
    errorHandle('getVeFlexStg3', 'metamask is not in smartbch mainnet');
    return undefined;
  }
}
export const getDailyPayoutStg3 = ( conn ) => {
  if (window.ethereum.networkVersion === '10000') {
    return new Contract(config.flex_dao_stg3.daily_payout, dailyPayout.abi, conn);
  } else {
    errorHandle('getDailyPayoutStg3', 'metamask is not in smartbch mainnet');
    return undefined;
  }
}
export const getDailyDistributorStg3 = ( conn ) => {
  if (window.ethereum.networkVersion === '10000') {
    return new Contract(config.flex_dao_stg3.daily_mini_distributor, distributor.abi, conn)
  } else {
    errorHandle('getDailyDistributorStg3', 'metamask is not in smartbch mainnet');
    return undefined;
  }
}