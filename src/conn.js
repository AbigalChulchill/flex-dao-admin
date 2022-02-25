import { ethers } from 'ethers';

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