import { useEffect, useState } from "react";
import { utils } from "ethers";
import { errorHandle, tsToLocalStr } from "../../utils";
import * as config from "../../config.json"

async function getAdmin(veflex) {
  try {
    return await veflex.admin();
  } catch (err) {
    errorHandle('getAdmin', err);
  }
}

async function getToken(veflex) {
  try {
    return await veflex.token();
  } catch (err) {
    errorHandle('getToken', err);
  }
}

async function getSupply(veflex) {
  try {
    return await veflex.supply();
  } catch (err) {
    errorHandle('getSupply', err);
  }
}

async function getTotalSupply(veflex) {
  try {
    return await veflex.totalSupply()
  } catch (err) {
    errorHandle('getTotalSupply', err);
  }
}

async function getLocked(veflex, value) {
  try {
    return await veflex.locked(value);
  } catch (err) {
    errorHandle('getLocked', err);
  }
}


async function getBalanceOf(veflex, value) {
  try {
    return await veflex.balanceOf(value);
  } catch (err) {
    errorHandle('getBalanceOf', err);
  }
}

async function getTotalSupplyAt(veflex, value) {
  try {
    return await veflex.totalSupplyAt(Number(value));
  } catch (err) {
    errorHandle('getTotalSupplyAt', err);
  }
}

async function getBalanceOfAt(veflex, address, height) {
  try {
    return await veflex.balanceOfAt(address, Number(height));
  } catch (err) {
    errorHandle('getBalanceOfAt', err);
  }
}

export function VeFLEX({ veflex }) {

  const [querying, setQuerying] = useState();

  const [name, setName] = useState();
  const [addr, setAddr] = useState();
  const [admin, setAdmin] = useState();

  const [token, setToken] = useState();
  const [supply, setSupply] = useState();
  const [totalSupply, setTotalSupply] = useState();

  const [locked, setLocked] = useState();

  const [balanceOf, setBalanceOf] = useState();
  const [totalSupplyAt, setTotalSupplyAt] = useState();
  const [balanceOfAt, setBalanceOfAt] = useState();

  const [balanceOfAtAddr, setBalanceOfAtAddr] = useState();

  const [depositEvents, setDepositEvents] = useState([]);
  const [depositEventsLoading, setDepositEventsLoading] = useState(false);

  const [withdrawEvents, setWithdrawEvents] = useState([]);
  const [withdrawEventsLoading, setWithdrawEventsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (veflex) {
        setName('veFlex');
        setAddr(veflex.address);

        const _admin = await getAdmin(veflex);
        if (_admin) setAdmin(_admin);

        const _token = await getToken(veflex);
        if (_token) setToken(_token);

        const _supply = await getSupply(veflex);
        if (_supply) setSupply(utils.formatEther(_supply));

        const _totalSupply = await getTotalSupply(veflex);
        if (_totalSupply) setTotalSupply(utils.formatEther(_totalSupply));
      }
    }
    fetchData();
  }, [veflex]);

  let lockTimer = undefined;
  const onLocked = async (e) => {
    if (lockTimer) clearTimeout(lockTimer);
    lockTimer = setTimeout( async ()=> {
      setLocked(undefined);
      if (querying) return;
      setQuerying(true);
      const value = e.target.value;
      if (veflex && value) {
        const _locked = await getLocked(veflex, value);
        if (_locked) setLocked([utils.formatEther(_locked.amount), _locked.end.toString()]);
      }
      setQuerying(false);
    }, config.query_response_millitime);
  }

  let balanceOfTimer = undefined;
  const onBalanceOf = async (e) => {
    if (balanceOfTimer) clearTimeout(balanceOfTimer);
    balanceOfTimer = setTimeout( async () => {
      setBalanceOf(undefined);
      if (querying) return;
      setQuerying(true);
      const value = e.target.value;
      if (veflex && value) {
        const _balanceOf = await getBalanceOf(veflex, value);
        if (_balanceOf) setBalanceOf(utils.formatEther(_balanceOf));
      }
      setQuerying(false);
    }, config.query_response_millitime);
  }

  let totalSupplyAtTimer = undefined;
  const onTotalSupplyAt = async (e) => {
    if (totalSupplyAtTimer) clearTimeout(totalSupplyAtTimer);
    totalSupplyAtTimer = setTimeout(async () => {      
      setTotalSupplyAt(undefined);
      if (querying) return;
      setQuerying(true);
      const value = e.target.value;
      if (veflex && value) {
        const _totalSupplyAt = await getTotalSupplyAt(veflex, value);
        if (_totalSupplyAt) setTotalSupplyAt(utils.formatEther(_totalSupplyAt));
      }
      setQuerying(false);
    }, config.query_response_millitime);
  }

  let balanceOfAtTimer = undefined;
  const onBalanceOfAt = async (e) => {
    if (balanceOfAtTimer) clearTimeout(balanceOfAtTimer);
    balanceOfAtTimer = setTimeout(async () => {
      setBalanceOfAt(undefined);
      if (querying) return;
      setQuerying(true);
      const value = e.target.value;
      if (veflex && value && balanceOfAtAddr) {
        const _balanceOfAt = await getBalanceOfAt(veflex, balanceOfAtAddr, value);
        if (_balanceOfAt) setBalanceOfAt(utils.formatEther(_balanceOfAt));
      }
      setQuerying(false);
    }, config.query_response_millitime);
  }

  const onBalanceOfAtAddr = async (e) => {
    setBalanceOfAt(undefined);
    setBalanceOfAtAddr(e.target.value);
  }

  const onQueryDepositHistory = async () => {
    setDepositEventsLoading(true);
    const _depositEventsFilter = veflex.filters.Deposit(null);
    const _depositEvents = await veflex.queryFilter(_depositEventsFilter);
    if (_depositEvents) {
      setDepositEvents(_depositEvents);
      setDepositEventsLoading(false);
    }
  }

  const onQueryWithdrawHistory = async () => {
    setWithdrawEventsLoading(true);
    const _withdrawEventsFilter = veflex.filters.Withdraw(null);
    const _withdrawEvents = await veflex.queryFilter(_withdrawEventsFilter);
    if (_withdrawEvents) {
      setWithdrawEvents(_withdrawEvents);
      setWithdrawEventsLoading(false);
    }
  }

  const depositItems = depositEvents.map( (event, index) => {
    return (
      <li key = {index}>
        {event.blockNumber}: {event.args.provider}, {utils.formatEther(event.args.value)}, {tsToLocalStr(event.args.locktime.toString())}, {event.args.type.toString()}, {tsToLocalStr(event.args.ts.toString())}
      </li>
    )
  })

  const withdrawItems = withdrawEvents.map( (event, index) => {
    return (
      <li key = {index}>
        {event.blockNumber}: {event.args.provider}, {utils.formatEther(event.args.value)}, {tsToLocalStr(event.args.ts.toString())}
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
          <li>Supply: {supply} FLEX</li>
          <li>Total Supply: {totalSupply} veFLEX</li>
        </ul>
      </div>
      <div className="query">
        <div className={"status-" + (querying ? "on" : "off")}>
          == Query Status: {querying ? "Querying" : "Not Query"} ==
        </div>
        <ul>
          <li>
            <label>
              Stake Detail For Address:
            </label>
            <input type="text" placeholder="address" onChange={onLocked} />
            {locked ? `staked ${locked[0]} FLEX, end at: ${new Date(locked[1] * 1000).toLocaleString()} Local Time` : ""}
          </li>
          <li>
            <label>
              Account Latest Balance:
            </label>
            <input type="text" placeholder="address" onChange={onBalanceOf} />
            {balanceOf} veFLEX
          </li>
          <li>
            <label>
              History Total Supply At Block Height:
            </label>
            <input type="text" placeholder="block height (uint)" onChange={onTotalSupplyAt} />
            {totalSupplyAt} veFLEX
          </li>
          <li>
            <label>
              History Account Balance At Block Height:
            </label>
            <input type="text" placeholder="address" onChange={onBalanceOfAtAddr} />
            <input type="text" placeholder="block height (uint)" onChange={onBalanceOfAt} />
            {balanceOfAt} veFLEX
          </li>
        </ul>
      </div>
      <div className="events">
        <div className="eventName">
          == Deposit History == 
        </div>
        <div className="eventList">
          <div>
            <button onClick={onQueryDepositHistory}>Query</button>
          </div>
          <ul>
            {depositEventsLoading ? "Loading" : depositItems}
          </ul>
          <p>total: {depositEvents.length}</p>
        </div>
        <div className="eventName">
          == Withdral History ==
        </div>
        <div className="eventList">
          <div>
            <button onClick={onQueryWithdrawHistory}>Query</button>
          </div>
          <ul>
            {withdrawEventsLoading ? "Loading" : withdrawItems}
          </ul>
          <p>total: {withdrawEvents.length}</p>
        </div>
      </div>
    </div>
  );
}
