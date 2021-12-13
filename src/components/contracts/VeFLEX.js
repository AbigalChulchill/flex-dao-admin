import { useEffect, useState } from "react";
import { utils } from "ethers";
import { errorHandle } from "../../utils";

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

  const onLocked = async (e) => {
    setLocked(undefined);
    if (querying) return;
    setQuerying(true);
    const value = e.target.value;
    if (veflex && value) {
      const _locked = await getLocked(veflex, value);
      if (_locked) setLocked([utils.formatEther(_locked.amount), _locked.end.toString()]);
    }
    setQuerying(false);
  }

  const onBalanceOf = async (e) => {
    setBalanceOf(undefined);
    if (querying) return;
    setQuerying(true);
    const value = e.target.value;
    if (veflex && value) {
      const _balanceOf = await getBalanceOf(veflex, value);
      if (_balanceOf) setBalanceOf(utils.formatEther(_balanceOf));
    }
    setQuerying(false);
  }

  const onTotalSupplyAt = async (e) => {
    setTotalSupplyAt(undefined);
    if (querying) return;
    setQuerying(true);
    const value = e.target.value;
    if (veflex && value) {
      const _totalSupplyAt = await getTotalSupplyAt(veflex, value);
      if (_totalSupplyAt) setTotalSupplyAt(utils.formatEther(_totalSupplyAt));
    }
    setQuerying(false);
  }

  const onBalanceOfAt = async (e) => {
    setBalanceOfAt(undefined);
    if (querying) return;
    setQuerying(true);
    const value = e.target.value;
    if (veflex && value && balanceOfAtAddr) {
      const _balanceOfAt = await getBalanceOfAt(veflex, balanceOfAtAddr, value);
      if (_balanceOfAt) setBalanceOfAt(utils.formatEther(_balanceOfAt));
    }
    setQuerying(false);
  }

  const onBalanceOfAtAddr = async (e) => {
    setBalanceOfAt(undefined);
    setBalanceOfAtAddr(e.target.value);
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
    </div>
  );
}
