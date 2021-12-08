import { useEffect, useState } from "react";
import { utils } from "ethers";
import {errorHandle, tsToLocalStr } from "../../utils";

async function getAdmin(payout) {
  try {
    return await payout.owner();
  } catch(err) {
    errorHandle('getAdmin', err);
  }
}

async function getToken(payout) {
  try {
    return await payout.token();
  } catch(err) {
    errorHandle('getToken', err);
  }
}

async function getVested(payout) {
  try {
    return await payout.vested();
  } catch(err) {
    errorHandle('getVested', err);
  }
}

async function getEpochLen(payout) {
  try {
    const _epochLen = await payout.epoch_period();
    return _epochLen.toString();
  } catch(err) {
    errorHandle('getEpochLen', err);
  }
}

async function getStartTime(payout) {
  try {
    const _startTime = await payout.startTime();
    return _startTime.toString();
  } catch(err) {
    errorHandle('getStartTime', err);
  }
}

async function getCurrentActiveEpoch(payout) {
  try {
    const _currentActiveEpoch = await payout.currentEpoch();
    return _currentActiveEpoch.sub(1).toString();
  } catch(err) {
    errorHandle('getCurrentActiveEpoch', err);
  }
}

async function queryHistoryEpochReward(payout, value) {
  try {
    const _reward = await payout.payoutForEpoch(Number(value));
    return utils.formatEther(_reward);
  } catch(err) {
    errorHandle('queryHistoryEpochReward', err);
  }
}

async function queryEpochStartBlockHeight(payout, value) {
  try {
    const _epochStartBlockHeight = await payout.blocknumberForEpoch(Number(value));
    return _epochStartBlockHeight.toString();
  } catch(err) {
    errorHandle('queryEpochStartBlockHeight', err);
  }
}

async function queryClaimable(payout, value) {
  try {
    const _claimable = await payout.getClaimable(value);
    return utils.formatEther(_claimable);
  } catch(err) {
    errorHandle('queryClaimable', err);
  }
}

async function queryIsDistributor(payout, value) {
  try {
    const _isDistributor = await payout.isDistributor(value);
    return _isDistributor? "YES" : "NO";
  } catch(err) {
    errorHandle('queryIsDistributor', err);
  }
}

async function queryBlockTimestamp(conn, height) {
  try {
    const _block = await conn.getBlock(Number(height));
    return _block && _block.timestamp ? _block.timestamp : undefined;
  } catch(err) {
    errorHandle('queryBlockTimestamp', err);
  }  
}

export function PayoutStg1({payout, conn}) {

  const [querying, setQuerying] = useState();

  const [name, setName] = useState();
  const [addr, setAddr] = useState();
  const [admin, setAdmin] = useState();
  const [token, setToken] = useState();
  const [veFlex, setVeFlex] = useState();
  const [epochLen, setEpochLen] = useState();
  const [startTime, setStartTime] = useState();
  const [currentActiveEpoch, setCurrentActiveEpoch] = useState();
  const [historyReward, setHistoryReward] = useState();
  const [epochStartBlockHeight, setEpochStartBlockHeight] = useState();
  const [blockTimeAtHeight, setBlockTimeAtHeight] = useState();
  const [claimable, setClaimable] = useState();
  const [isDistributor, setIsdistributor] = useState();
  
  useEffect( () => {
    async function fetchData() {
      if (payout) {
        setName('Daily Payout');
        setAddr(payout.address);

        const _admin = await getAdmin(payout);
        if (_admin) setAdmin(_admin);
        
        const _token = await getToken(payout);
        if (_token) setToken(_token);
  
        const _veFlex = await getVested(payout);
        if (_veFlex) setVeFlex(_veFlex);
  
        const _epochLen = await getEpochLen(payout);
        if (_epochLen) setEpochLen(_epochLen);
  
        const _startTime = await getStartTime(payout);
        if (_startTime) setStartTime(_startTime);
  
        const _currentActiveEpoch = await getCurrentActiveEpoch(payout);
        if(_currentActiveEpoch) setCurrentActiveEpoch(_currentActiveEpoch);
      }
    }
    fetchData();
  }, [payout, conn]);

  const onHistoryEpochReward = async (e) => {
    setHistoryReward(undefined);
    if (querying) return; 
    setQuerying(true);
    const value = e.target.value;
    if (payout && value) {
      const _reward = await queryHistoryEpochReward(payout, value);
      if (_reward) setHistoryReward(_reward);
    }
    setQuerying(false);
  }

  const onEpochStartBlockHeight = async (e) => {
    setEpochStartBlockHeight(undefined);
    setBlockTimeAtHeight(undefined);
    if (querying) return; 
    setQuerying(true);
    const value = e.target.value;
    if (payout && value) {
      const _epochStartBlockHeight = await queryEpochStartBlockHeight(payout, value);
      if (_epochStartBlockHeight) {
        setEpochStartBlockHeight(_epochStartBlockHeight);
        
        // query block metadata to fetch block timestamp
        const _blockTimeAtHeight = await queryBlockTimestamp(conn, _epochStartBlockHeight);
        if (_blockTimeAtHeight) setBlockTimeAtHeight(_blockTimeAtHeight);
      }
    }
    setQuerying(false);
  }

  const onClaimable = async (e) => {
    setClaimable(undefined);
    if (querying) return; 
    setQuerying(true);
    const value = e.target.value;
    if (payout && value) {
      const _claimable = await queryClaimable(payout, value);
      if (_claimable) setClaimable(_claimable);
    }
    setQuerying(false);
  }

  const onIsDistributor = async (e) => {
    setIsdistributor(undefined);
    if (querying) return; 
    setQuerying(true);
    const value = e.target.value;
    if (payout && value) {
      const _isDistributor = await queryIsDistributor(payout, value);
      if (_isDistributor) setIsdistributor(_isDistributor);
    }
    setQuerying(false);
  }

  return (
    <div className="box">
      <div className="info">
        <div className="bulletin">
          == Basic Info ==
        </div>
        <ul>
          <li>Contract Name: {name}</li>
          <li>Contract Addr: {addr}</li>
          <li>Contract Admin: {admin}</li>
          <li>FLEX Addr: {token}</li>
          <li>VeFLEX Addr: {veFlex}</li>
          <li>Epoch Length: {epochLen} Seconds</li>
          <li>Payout Start Timestamp: {startTime} {tsToLocalStr(startTime)}</li>
          <li>Current Active Epoch: {currentActiveEpoch}</li>
        </ul>
      </div>
      <div className="query">
        <div className="status">
          == Query Status: {querying? "Querying": "Not Query"} ==
        </div>
        <ul>
          <li>
            <label>
              History Epoch Reward:
            </label>
            <input type="text" placeholder="epoch index (uint)" onChange={onHistoryEpochReward} />
            {historyReward} FLEX
          </li>
          <li>
            <label>
              Epoch Start Block Height:
            </label>
            <input type="text" placeholder="epoch index (uint)" onChange={onEpochStartBlockHeight} />
            {epochStartBlockHeight}
            <p>{blockTimeAtHeight} {tsToLocalStr(blockTimeAtHeight)}</p>
          </li>
          <li>
            <label>
              Claimable Amount:
            </label>
            <input type="text" placeholder="address" onChange={onClaimable} />
            {claimable} FLEX
          </li>
          <li>
            <label>
              Is Distributor:
            </label>
            <input type="text" placeholder="address" onChange={onIsDistributor} />
            {isDistributor}
          </li>
        </ul>
      </div>
    </div>
  );
}
