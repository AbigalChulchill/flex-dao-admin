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

async function queryBlockTimestamp(conn, height) {
  try {
    const _block = await conn.getBlock(Number(height));
    return _block && _block.timestamp ? _block.timestamp : undefined;
  } catch(err) {
    errorHandle('queryBlockTimestamp', err);
  }  
}

async function getFlexBalance(flex, address) {
  try {
    return await flex.balanceOf(address);
  } catch (err) {
    errorHandle('getFlexBalance', err);
  }
}

function getCurrentExpectEpoch(startTs) {
  if (!startTs) return -1;
  const now = Date.now() / 1000;
  const oneDay = 86400;
  return Math.floor((now - startTs) / oneDay);
}

export function Payout({payout, conn, flex, startTs}) {

  const [querying, setQuerying] = useState();

  const [name, setName] = useState();
  const [addr, setAddr] = useState();
  const [admin, setAdmin] = useState();
  const [token, setToken] = useState();
  const [veFlex, setVeFlex] = useState();
  const [contractBalance, setContractBalance] = useState();
  const [epochLen, setEpochLen] = useState();
  const [startBlockHeight, setStartBlockHeight] = useState();
  const [startTime, setStartTime] = useState();
  const [expectCurrentEpoch, setExpectCurrentEpoch] = useState();
  const [currentEpoch, setCurrentEpoch] = useState();
  const [currentActiveEpoch, setCurrentActiveEpoch] = useState();
  
  const [epochForHistoryReward, setEpochForHistoryReward] = useState(); 
  const [historyReward, setHistoryReward] = useState();

  const [epochForEpochStartBlockHeight, setEpochForEpochStartBlockHeight] = useState();
  const [epochStartBlockHeight, setEpochStartBlockHeight] = useState();
  const [blockTimeAtHeight, setBlockTimeAtHeight] = useState();

  const [addressClaimable, setAddressClaimable] = useState();
  const [claimable, setClaimable] = useState();

  const [addressIsDistributor, setAddressIsdistributor] = useState();
  const [isDistributor, setIsdistributor] = useState();
  
  const [addressIsOperator, setAddressIsOperator] = useState();
  const [isOperator, setIsOperator] = useState();
  
  const [claimEvents, setClaimEvents] = useState([]);
  const [claimEventsLoading, setClaimEventsLoading] = useState(false);

  const [distributeEvents, setDistributeEvents] = useState([]);
  const [distributeEventsLoading, setDistributeEventsLoading] = useState(false);
  
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

        const _balance = await getFlexBalance(flex, payout.address);
        if (_balance) setContractBalance(utils.formatEther(_balance));
  
        const _startBlockHeight = await getStartBlockHeight(payout);
        if (_startBlockHeight) {
          setStartBlockHeight(_startBlockHeight);
          const _startTime = await queryBlockTimestamp(conn, _startBlockHeight);
          if (_startTime) setStartTime(_startTime);
        }

        const _expectCurrentEpoch = getCurrentExpectEpoch(startTs);
        if(_expectCurrentEpoch !== undefined) setExpectCurrentEpoch(_expectCurrentEpoch);
  
        const _currentEpoch = await getCurrentEpoch(payout);
        if(_currentEpoch) setCurrentEpoch(_currentEpoch);
  
        const _currentActiveEpoch = await getCurrentActiveEpoch(payout);
        if(_currentActiveEpoch) setCurrentActiveEpoch(_currentActiveEpoch);
      }
    }
    fetchData();
  }, [payout, conn, flex, startTs]);

  const onHistoryReward = async (e) => {
    e.preventDefault();
    setHistoryReward(undefined);
    if (querying) return; 
    setQuerying(true);
    if (payout && epochForHistoryReward) {
      const _reward = await queryHistoryEpochReward(payout, epochForHistoryReward);
      if (_reward) setHistoryReward(_reward);
    }
    setQuerying(false);
  }

  const onEpochStartBlockHeight = async (e) => {
    e.preventDefault();
    setEpochStartBlockHeight(undefined);
    setBlockTimeAtHeight(undefined);
    if (querying) return; 
    setQuerying(true);
    if (payout && epochForEpochStartBlockHeight) {
      const _epochStartBlockHeight = await queryEpochStartBlockHeight(payout, epochForEpochStartBlockHeight);
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
    e.preventDefault();
    setClaimable(undefined);
    if (querying) return; 
    setQuerying(true);
    if (payout && addressClaimable) {
      const _claimable = await queryClaimable(payout, addressClaimable);
      if (_claimable) setClaimable(_claimable);
    }
    setQuerying(false);
  }

  const onIsDistributor = async (e) => {
    e.preventDefault();
    setIsdistributor(undefined);
    if (querying) return; 
    setQuerying(true);
    if (payout && addressIsDistributor) {
      const _isDistributor = await queryIsDistributor(payout, addressIsDistributor);
      if (_isDistributor) setIsdistributor(_isDistributor);
    }
    setQuerying(false);
  }

  const onIsOperator = async (e) => {
    e.preventDefault();
    setIsOperator(undefined);
    if (querying) return; 
    setQuerying(true);
    const value = e.target.value;
    if (payout && addressIsOperator) {
      const _isOperator = await queryIsOperator(payout, addressIsOperator);
      if (_isOperator) setIsOperator(_isOperator);
    }
    setQuerying(false);
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

  const onQueryDistributeHistory = async () => {
    setDistributeEventsLoading(true);
    const _distributeEventsFilter = payout.filters.Distribute(null);
    const _distributeEvents = await payout.queryFilter(_distributeEventsFilter);
    if (_distributeEvents) {
      setDistributeEvents(_distributeEvents);
      setDistributeEventsLoading(false);
    }
  }

  const claimItems = claimEvents.map( (event, index) => {
    return (
      <li key = {index}>
        {event.blockNumber}: {event.args.from}, {utils.formatEther(event.args.amount)}, {event.args.lastClaimedEpoch.toString()}
      </li>
    )
  })

  const distributeItems = distributeEvents.map( (event, index) => {
    return (
      <li key = {index}>
        {event.blockNumber}: {event.args.distributor}, {utils.formatEther(event.args.amount)}
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
          <li>Epoch Length: {epochLen}</li>
          <li>Payout Start Block Height: {startBlockHeight}</li>
          <li>Payout Start Time: {startTime} {tsToLocalStr(startTime)}</li>
          <li>Current Expect Epoch: {expectCurrentEpoch}</li>
          <li>Current Epoch: {currentEpoch}</li>
          <li>Current Active Epoch: {currentActiveEpoch}</li>
        </ul>
      </div>
      <div className="query">
        <div className={"status-" + (querying ? "on" : "off")}>
          == Query Status: {querying? "Querying": "Not Query"} ==
        </div>
        <ul>
          <li>
            <form>
              <label>
                History Epoch Reward:
              </label>
              <input type="text" placeholder="epoch index (uint)" onChange={e=>setEpochForHistoryReward(e.target.value)} />
              <button onClick={onHistoryReward}>Read</button>
              <span>{historyReward} {historyReward?'FLEX':''}</span> 
            </form>
          </li>
          <li>
            <form>
              <label>
                Epoch Start Block Height:
              </label>
              <input type="text" placeholder="epoch index (uint)" onChange={e=>setEpochForEpochStartBlockHeight(e.target.value)} />
              <button onClick={onEpochStartBlockHeight}>Read</button>
              {epochStartBlockHeight} <b>{blockTimeAtHeight} {tsToLocalStr(blockTimeAtHeight)}</b>
            </form>
          </li>
          <li>
            <form>
              <label>
                Claimable Amount:
              </label>
              <input type="text" placeholder="address" onChange={e=>setAddressClaimable(e.target.value)} />
              <button onClick={onClaimable}>Read</button>
              {claimable} {claimable?"FLEX":""}
            </form>
          </li>
          <li>
            <form>
              <label>
                Is Distributor:
              </label>
              <input type="text" placeholder="address" onChange={e=>setAddressIsdistributor(e.target.value)} />
              <button onClick={onIsDistributor}>Read</button>
              {isDistributor}
            </form>
          </li>
          <li>
            <form>
              <label>
                Is Operator:
              </label>
              <input type="text" placeholder="address" onChange={e=>setAddressIsOperator(e.target.value)} />
              <button onClick={onIsOperator}>Read</button>
              {isOperator}
            </form>
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
          <p>total: {claimEvents.length}</p>
        </div>
        <div className="eventName">
          == Distribute History == 
        </div>
        <div className="eventList">
          <div>
            <button onClick={onQueryDistributeHistory}>Query</button>
          </div>
          <ul>
            {distributeEventsLoading ? "Loading" : distributeItems}
          </ul>
          <p>total: {distributeEvents.length}</p>
        </div>
      </div>
    </div>
  );
}
