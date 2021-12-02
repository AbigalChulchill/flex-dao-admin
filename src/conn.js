import { ethers, Contract } from 'ethers';
import * as flex from './contracts/FLEXCoin.json'
import * as veFlex from './contracts/veFLEX.json'
import * as dailyPayout from './contracts/DailyPayout.json'
import * as distributor from './contracts/Distributor.json'
import * as config from './config.json'

export const getConn = () => {
  return new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if (window && window.ethereum) {
        await window.ethereum.enable();
        const proveder = new ethers.providers.Web3Provider(window.ethereum);
        const signer = proveder.getSigner();

        if (window.ethereum.networkVersion !== '10000') {
          return reject('metamask is not in smartbch mainnet');
        } else {
          return resolve(signer);
        }
      }
    });
  });
}

export const getFlex = ( conn ) => {
  return new Contract(config.contracts_addr.flex, flex.abi, conn)
}
export const getVeFlex = ( conn ) => {
  return new Contract(config.contracts_addr.veFLEX, veFlex.abi, conn)
}
export const getDailyPayout = ( conn ) => {
  return new Contract(config.contracts_addr.daily_payout, dailyPayout.abi, conn)
}
export const getDistributor = ( conn ) => {
  return new Contract(config.contracts_addr.daily_mini_distributor, distributor.abi, conn)
}
