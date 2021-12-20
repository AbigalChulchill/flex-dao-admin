import { useEffect, useState } from "react";
import { utils } from "ethers";
import {errorHandle, tsToLocalStr } from "../../utils";
import * as config from "../../config.json"

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

async function getFlexBalance(flex, address) {
  try {
    return await flex.balanceOf(address);
  } catch (err) {
    errorHandle('getFlexBalance', err);
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

export function PayoutStg1({payout, conn, flex}) {

  const [querying, setQuerying] = useState();

  const [name, setName] = useState();
  const [addr, setAddr] = useState();
  const [admin, setAdmin] = useState();
  const [token, setToken] = useState();
  const [contractBalance, setContractBalance] = useState();
  const [veFlex, setVeFlex] = useState();
  const [epochLen, setEpochLen] = useState();
  const [startTime, setStartTime] = useState();
  const [currentActiveEpoch, setCurrentActiveEpoch] = useState();
  const [historyReward, setHistoryReward] = useState();
  const [epochStartBlockHeight, setEpochStartBlockHeight] = useState();
  const [blockTimeAtHeight, setBlockTimeAtHeight] = useState();
  const [claimable, setClaimable] = useState();
  const [isDistributor, setIsdistributor] = useState();

  const [claimEvents, setClaimEvents] = useState([]);
  const [claimEventsLoading, setClaimEventsLoading] = useState(false);
  
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
      
        const _balance = await getFlexBalance(flex, payout.address);
        if (_balance) setContractBalance(utils.formatEther(_balance));
  
        const _epochLen = await getEpochLen(payout);
        if (_epochLen) setEpochLen(_epochLen);
  
        const _startTime = await getStartTime(payout);
        if (_startTime) setStartTime(_startTime);
  
        const _currentActiveEpoch = await getCurrentActiveEpoch(payout);
        if(_currentActiveEpoch) setCurrentActiveEpoch(_currentActiveEpoch);
      }
    }
    fetchData();
  }, [payout, conn, flex]);

  let historyEpochTimer = undefined;
  const onHistoryEpochReward = async (e) => {
    if (historyEpochTimer) clearTimeout(historyEpochTimer);
      historyEpochTimer = setTimeout( async ()=>{
      setHistoryReward(undefined);
      if (querying) return; 
      setQuerying(true);
      const value = e.target.value;
      if (payout && value) {
        const _reward = await queryHistoryEpochReward(payout, value);
        if (_reward) setHistoryReward(_reward);
      }
      setQuerying(false);
    }, config.query_response_millitime)
  }

  let epochStartTimer = undefined;
  const onEpochStartBlockHeight = async (e) => {
    if (epochStartTimer) clearTimeout(epochStartTimer);
    epochStartTimer = setTimeout( async ()=>{
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
    }, config.query_response_millitime)
  }

  let claimTimer = undefined;
  const onClaimable = async (e) => {
    if(claimTimer) clearTimeout(claimTimer);
    claimTimer = setTimeout( async ()=>{
      setClaimable(undefined);
      if (querying) return; 
      setQuerying(true);
      const value = e.target.value;
      if (payout && value) {
        const _claimable = await queryClaimable(payout, value);
        if (_claimable) setClaimable(_claimable);
      }
      setQuerying(false);
    }, config.query_response_millitime)
  }

  let distributorTimer = undefined;
  const onIsDistributor = async (e) => {
    if (distributorTimer) clearTimeout(distributorTimer);
      distributorTimer = setTimeout( async ()=>{
      setIsdistributor(undefined);
      if (querying) return; 
      setQuerying(true);
      const value = e.target.value;
      if (payout && value) {
        const _isDistributor = await queryIsDistributor(payout, value);
        if (_isDistributor) setIsdistributor(_isDistributor);
      }
      setQuerying(false);
    }, config.query_response_millitime)  
  }

  const onQueryClaimHistory = async () => {
    setClaimEventsLoading(true);
    const _claimEventsFilter = payout.filters.Claim(null);
    const _claimEvents = await payout.queryFilter(_claimEventsFilter);
    if (_claimEvents) {
      setClaimEvents(_claimEvents);
      setClaimEventsLoading(false);
    }
  }

  const claimItems = claimEvents.map( (event, index) => {
    return (
      <li key = {index}>
        {event.blockNumber}: {event.args.from}, {utils.formatEther(event.args.amount)}
      </li>
    )
  })

  return (
    <div className="box">
      <div className="info">
        <div className="bulletin">
          == Contract Name: {name} ==
        </div>
        <ul>
          <li>Contract Addr: {addr}</li>
          <li>Contract Admin: {admin}</li>
          <li>FLEX Addr: {token}</li>
          <li>VeFLEX Addr: {veFlex}</li>
          <li>Contract FLEX balance: {contractBalance} FLEX</li>
          <li>Epoch Length: {epochLen} Seconds</li>
          <li>Payout Start Timestamp: {startTime} {tsToLocalStr(startTime)}</li>
          <li>Current Active Epoch: {currentActiveEpoch}</li>
        </ul>
      </div>
      <div className="query">
        <div className={"status-" + (querying ? "on" : "off")}>
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
      <div className="events">
        <div className="eventName">
          == Claim History == 
        </div>
        <div className="eventList">
          <div>
            <button onClick={onQueryClaimHistory}>Query</button>
          </div>
          <ul>
            {claimEventsLoading ? "Loading" : claimItems}
          </ul>
        </div>
      </div>
    </div>
  );
}
