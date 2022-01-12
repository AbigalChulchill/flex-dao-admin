import { useEffect, useState } from "react";
import { utils } from "ethers";
import { errorHandle, tsToLocalStr } from "../../utils";

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

async function depositFor(veflex, address, amount) {
  try {
    return await veflex.deposit_for(address, Number(amount));
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

  const [addressLocked, setAddressLocked] = useState();
  const [locked, setLocked] = useState();

  const [addressBalanceOf, setAddressBalanceOf] = useState();
  const [balanceOf, setBalanceOf] = useState();

  const [heightTotalSupplyAt, setHeightTotalSupplyAt] = useState();
  const [totalSupplyAt, setTotalSupplyAt] = useState();

  const [addressBalanceOfAt, setAddressBalanceOfAt] = useState();
  const [heightBalanceOfAt, setHeightBalanceOfAt] = useState();
  const [balanceOfAt, setBalanceOfAt] = useState();

  const [addressDepositFor, setAddressDepositFor] = useState();
  const [amountDepositFor, setAmountDepositFor] = useState();

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
    return () => {
      setName();
      setAddr();
      setAdmin();
      setToken();
      setSupply();
      setTotalSupply();
    }
  }, [veflex]);

  const onLocked = async (e) => {
    e.preventDefault();
    setLocked(undefined);
    if (querying) return;
    setQuerying(true);
    if (veflex && addressLocked) {
      const _locked = await getLocked(veflex, addressLocked);
      if (_locked) setLocked([utils.formatEther(_locked.amount), _locked.end.toString()]);
    }
    setQuerying(false);
  }

  const onBalanceOf = async (e) => {
    e.preventDefault();
    setBalanceOf(undefined);
    if (querying) return;
    setQuerying(true);
    if (veflex && addressBalanceOf) {
      const _balanceOf = await getBalanceOf(veflex, addressBalanceOf);
      if (_balanceOf) setBalanceOf(utils.formatEther(_balanceOf));
    }
    setQuerying(false);
  }

  const onTotalSupplyAt = async (e) => {
    e.preventDefault()
    setTotalSupplyAt(undefined);
    if (querying) return;
    setQuerying(true);
    if (veflex && heightTotalSupplyAt) {
      const _totalSupplyAt = await getTotalSupplyAt(veflex, heightTotalSupplyAt);
      if (_totalSupplyAt) setTotalSupplyAt(utils.formatEther(_totalSupplyAt));
    }
    setQuerying(false);
  }

  const onBalanceOfAt = async (e) => {
    e.preventDefault();
    setBalanceOfAt(undefined);
    if (querying) return;
    setQuerying(true);
    if (veflex && addressBalanceOfAt && heightBalanceOfAt) {
      const _balanceOfAt = await getBalanceOfAt(veflex, addressBalanceOfAt, heightBalanceOfAt);
      if (_balanceOfAt) setBalanceOfAt(utils.formatEther(_balanceOfAt));
    }
    setQuerying(false);
  }

  const onDepositFor = async (e) => {
    e.preventDefault()
    if (querying) return;
    setQuerying(true);
    if (veflex && addressDepositFor && amountDepositFor) {
      await depositFor(veflex, addressDepositFor, amountDepositFor);
    }
    setQuerying(false);
  }

  const onQueryDepositHistory = async () => {
    setDepositEventsLoading(true);
    const _depositEventsFilter = veflex.filters.Deposit(null);
    const _depositEvents = await veflex.queryFilter(_depositEventsFilter);
    if (_depositEvents) {
      setDepositEvents(_depositEvents);
      setDepositEventsLoading(false);
    }
    
    const uniAddresses = new Map();
    for (let event of _depositEvents) {
      if (!uniAddresses.has(event.args.provider)) {
        uniAddresses.set(event.args.provider, undefined)
      }
    }
    console.log(`unique address: ${uniAddresses.size}`)

    let count = 0
    for (let addr of uniAddresses.keys()) {
      const _locked = await veflex.locked(addr);
      if (!_locked.amount.eq(0)) {
        console.log(`${addr}  ${utils.formatEther(_locked.amount)}  ${_locked.end.toString()}`);
        count++;
      }
    }
    console.log(`total: ${count}`);
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
            <form>
              <label>
                Stake Detail For Address:
              </label>
              <input type="text" placeholder="address" onChange={e=>setAddressLocked(e.target.value)} />
              <button onClick={onLocked}>Read</button>
              {locked ? `staked ${locked[0]} FLEX, end at: ${new Date(locked[1] * 1000).toLocaleString()} Local Time` : ""}
            </form>
          </li>
          <li>
            <form>
              <label>
                Account Latest Balance:
              </label>
              <input type="text" placeholder="address" onChange={e=>setAddressBalanceOf(e.target.value)} />
              <button onClick={onBalanceOf}>Read</button>
              <span>{balanceOf} {balanceOf?"veFLEX":""}</span>
            </form>
          </li>
          <li>
            <form>
              <label>
                History Total Supply At Block Height:
              </label>
              <input type="text" placeholder="block height (uint)" onChange={e=>setHeightTotalSupplyAt(e.target.value)} />
              <button onClick={onTotalSupplyAt}>Read</button>
              <span>{totalSupplyAt} {totalSupplyAt?"veFLEX":""}</span>
            </form>
          </li>
          <li>
            <form>
              <label>
                History Account Balance At Block Height:
              </label>
              <input type="text" placeholder="address" onChange={e=>setAddressBalanceOfAt(e.target.value)} />
              <input type="text" placeholder="block height (uint)" onChange={e=>setHeightBalanceOfAt(e.target.value)} />
              <button onClick={onBalanceOfAt}>Read</button>
              <span>{balanceOfAt} {balanceOfAt?"veFLEX":""}</span>
            </form>
          </li>
          <li>
            <form>
              <label>
                Stake For Other Address:
              </label>
              <input type="text" placeholder="address" onChange={e=>setAddressDepositFor(e.target.value)} />
              <input type="text" placeholder="amount (FLEX)" onChange={e=>setAmountDepositFor(e.target.value)} />
              <button onClick={onDepositFor}>Write</button>
            </form>
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
