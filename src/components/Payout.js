import { useEffect, useState } from "react";
import { utils } from "ethers";
import {errorHandle } from "../utils";

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
    const _epochLen = await payout.EPOCH_BLOCKS();
    return _epochLen.toString();
  } catch(err) {
    errorHandle('getEpochLen', err);
  }
}

async function getStartBlockHeight(payout) {
  try {
    const _startBlockHeight = await payout.startBlockHeight();
    return _startBlockHeight.toString();
  } catch(err) {
    errorHandle('getStartBlockHeight', err);
  }
}

async function getCurrentEpoch(payout) {
  try {
    const _currentEpoch = await payout.getCurrentEpoch();
    return _currentEpoch.toString();
  } catch(err) {
    errorHandle('getCurrentEpoch', err);
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
    const _epochStartBlockHeight = await payout.getEpochStartBlockHeight(Number(value));
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

async function queryIsOperator(payout, value) {
  try {
    const _isOperator = await payout.isOperator(value);
    return _isOperator? "YES": "NO";
  } catch(err) {
    errorHandle('queryIsOperator', err);
  }
}

export function Payout({payout}) {

  const [querying, setQuerying] = useState();

  const [name, setName] = useState();
  const [addr, setAddr] = useState();
  const [admin, setAdmin] = useState();
  const [token, setToken] = useState();
  const [veFlex, setVeFlex] = useState();
  const [epochLen, setEpochLen] = useState();
  const [startBlockHeight, setStartBlockHeight] = useState();
  const [currentEpoch, setCurrentEpoch] = useState();
  const [currentActiveEpoch, setCurrentActiveEpoch] = useState();
  const [historyReward, setHistoryReward] = useState();
  const [epochStartBlockHeight, setEpochStartBlockHeight] = useState();
  const [claimable, setClaimable] = useState();
  const [isDistributor, setIsdistributor] = useState();
  const [isOperator, setIsOperator] = useState();
  
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
  
        const _startBlockHeight = await getStartBlockHeight(payout);
        if (_startBlockHeight) setStartBlockHeight(_startBlockHeight);
  
        const _currentEpoch = await getCurrentEpoch(payout);
        if(_currentEpoch) setCurrentEpoch(_currentEpoch);
  
        const _currentActiveEpoch = await getCurrentActiveEpoch(payout);
        if(_currentActiveEpoch) setCurrentActiveEpoch(_currentActiveEpoch);
      }
    }
    fetchData();
  }, [payout]);

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
    if (querying) return; 
    setQuerying(true);
    const value = e.target.value;
    if (payout && value) {
      const _epochStartBlockHeight = await queryEpochStartBlockHeight(payout, value);
      if (_epochStartBlockHeight) setEpochStartBlockHeight(_epochStartBlockHeight);
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

  const onIsOperator = async (e) => {
    setIsOperator(undefined);
    if (querying) return; 
    setQuerying(true);
    const value = e.target.value;
    if (payout && value) {
      const _isOperator = await queryIsOperator(payout, value);
      if (_isOperator) setIsOperator(_isOperator);
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
          <li>Epoch Length: {epochLen}</li>
          <li>Payout Start Block Height: {startBlockHeight}</li>
          <li>Current Epoch: {currentEpoch}</li>
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
          <li>
            <label>
              Is Operator:
            </label>
            <input type="text" placeholder="address" onChange={onIsOperator} />
            {isOperator}
          </li>
        </ul>
      </div>
    </div>
  );
}
