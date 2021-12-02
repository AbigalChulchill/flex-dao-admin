import { useEffect, useState } from "react";
import { utils } from "ethers";
import { errorHandle } from "../utils";

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

async function getLocked(veflex, value) {
  try {
    return await veflex.locked(value);
  } catch (err) {
    errorHandle('getLocked', err);
  }
}

async function getTotalSupply(veflex, value) {
  try {
    if (value === -1) {
      return await veflex.totalSupply();
    } else {
      return await veflex.totalSupply(Number(value));
    }
  } catch (err) {
    errorHandle('getTotalSupply', err);
  }
}

async function getBalanceOf(veflex, value) {
  try {
    if (value === -1) {
      return await veflex.balanceOf();
    } else {
      return await veflex.balanceOf(Number(value));
    }
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

async function getBalanceOfAt(veflex, value) {
  try {
    return await veflex.balanceOfAt(Number(value));
  } catch (err) {
    errorHandle('getBalanceOfAt', err);
  }
}

export function VeFLEX({ veflex }) {

  const [querying, setQuerying] = useState();

  const [name, setName] = useState();
  const [addr, setAddr] = useState();

  const [token, setToken] = useState();
  const [supply, setSupply] = useState();

  const [locked, setLocked] = useState();

  const [totalSupply, setTotalSupply] = useState();
  const [balanceOf, setBalanceOf] = useState();
  const [totalSupplyAt, setTotalSupplyAt] = useState();
  const [balanceOfAt, setBalanceOfAt] = useState();

  useEffect(() => {
    async function fetchData() {
      if (veflex) {
        setName('veFlex');

        setAddr(veflex.address);

        const _token = await getToken(veflex);
        if (_token) setToken(_token);

        const _supply = await getSupply(veflex);
        if (_supply) setSupply(utils.formatEther(_supply));
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

  const onTotalSupply = async (e) => {
    setTotalSupply(undefined);
    if (querying) return;
    setQuerying(true);
    const value = e.target.value;
    if (veflex && value) {
      const _totalSupply = await getTotalSupply(veflex, value);
      if (_totalSupply) setTotalSupply(utils.formatEther(_totalSupply));
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
    if (veflex && value) {
      const _balanceOfAt = await getBalanceOfAt(veflex, value);
      if (_balanceOfAt) setBalanceOfAt(utils.formatEther(_balanceOfAt));
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
          <li>FLEX addr: {token}</li>
          <li>Supply: {supply} FLEX</li>
        </ul>
      </div>
      <div className="query">
        <div className="status">
          == Query Status: {querying ? "Querying" : "Not Query"} ==
        </div>
        <ul>
          <li>
            <label>
              Stake Detail for address:
            </label>
            <input type="text" onChange={onLocked} />
            {locked ? `staked ${locked[0]} FLEX, end at: ${new Date(locked[1] * 1000).toLocaleString()} Local Time` : ""}
          </li>
          <li>
            <label>
              Total supply at timestamp (-1 return the latest total supply):
            </label>
            <input type="text" onChange={onTotalSupply} />
            {totalSupply} veFLEX
          </li>
          <li>
            <label>
              Account balance at timestamp (-1 return the latest account balance):
            </label>
            <input type="text" onChange={onBalanceOf} />
            {balanceOf} veFLEX
          </li>
          <li>
            <label>
              Total supply at block height:
            </label>
            <input type="text" onChange={onTotalSupplyAt} />
            {totalSupplyAt} veFLEX
          </li>
          <li>
            <label>
              Account balance at block height:
            </label>
            <input type="text" onChange={onBalanceOfAt} />
            {balanceOfAt} veFLEX
          </li>
        </ul>
      </div>
    </div>
  );
}
