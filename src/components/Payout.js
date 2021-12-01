import { useEffect, useState } from "react";
import { getPayout } from '../conn'

export function Payout({conn}) {

  const [addr, setAddr] = useState();
  const [token, setToken] = useState();
  const [veFlex, setVeFlex] = useState();
  const [epochLen, setEpochLen] = useState();
  const [startBlockHeight, setStartBlockHeight] = useState();
  const [currentEpoch, setCurrentEpoch] = useState();
  const [currentActiveEpoch, setCurrentActiveEpoch] = useState();
//   const [HistoryReward, setHistoryReward] = useState();
//   const [epochStartBlockHeight, setEpochStartBlockHeight] = useState();
//   const [claimable, setClaimable] = useState();
//   const [isDistributor, setIsdistributor] = useState();
//   const [isOperator, setIsOperator] = useState();
  
  useEffect( () => {
    async function fetchData() {
      try {
        const payout = getPayout(conn);
        
        const _addr = payout.address;
        console.log(addr);
        setAddr(_addr);
        
        const _token = await payout.token();
        console.log(_token);
        setToken(_token);

        const _veFlex = await payout.vested();
        console.log(_veFlex);
        setVeFlex(_veFlex);

        const _epochLen = await payout.EPOCH_BLOCKS();
        console.log(_epochLen.toString());
        setEpochLen(_epochLen.toString());

        const _startBlockHeight = await payout.startBlockHeight();
        console.log(_startBlockHeight.toString());
        setStartBlockHeight(_startBlockHeight.toString());

        const _currentEpoch = await payout.getCurrentEpoch();
        console.log(_currentEpoch.toString());
        setCurrentEpoch(_currentEpoch.toString());

        const _currentActiveEpoch = await payout.currentEpoch();
        console.log(_currentActiveEpoch.toString());
        setCurrentActiveEpoch(_currentActiveEpoch.toString());

      } catch (err) {
        if (err.data && err.data.message) {
          window.alert(err.data.message);
        } else {
          window.alert(err);
        }
      } 
    }
    fetchData();
  }, []);

  return (
    <div className="box">
      <p>I am payout</p>
    </div>
  );
}
