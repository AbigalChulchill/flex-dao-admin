import { useEffect, useState } from "react";
import { utils } from 'ethers';
import { errorHandle } from "../utils";

async function getAdmin(flex) {
  try {
    return await flex.owner();
  } catch (err) {
    errorHandle('getAdmin', err);
  }
}

async function getTotalSupply(flex) {
  try {
    return await flex.totalSupply();
  } catch (err) {
    errorHandle('getTotalSupply', err);
  }
}

async function getBalanceOf(flex, value) {
  try {
    return await flex.balanceOf(value);
  } catch (err) {
    errorHandle('getBalanceOf', err);
  }
}

export function FLEX({ flex }) {

  const [querying, setQuerying] = useState();

  const [name, setName] = useState();
  const [addr, setAddr] = useState();
  const [admin, setAdmin] = useState();
  const [totalSupply, setTotalSupply] = useState();

  const [balanceOf, setBalanceOf] = useState();

  useEffect(() => {
    async function fetchData() {
      if (flex) {
        setName('FLEX');
        setAddr(flex.address);

        const _admin = await getAdmin(flex);
        if (_admin) setAdmin(_admin);

        const _totalSupply = await getTotalSupply(flex);
        if (_totalSupply) setTotalSupply(utils.formatEther(_totalSupply));
      }
    }
    fetchData();
  }, [flex]);

  const onBalanceOf = async (e) => {
    setBalanceOf(undefined);
    if (querying) return;
    setQuerying(true);
    const value = e.target.value;
    if (flex && value) {
      const _balanceOf = await getBalanceOf(flex, value);
      if (_balanceOf) setBalanceOf(utils.formatEther(_balanceOf));
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
          <li>Total Supply: {totalSupply} FLEX</li>
        </ul>
      </div>
      <div className="query">
        <div className="status">
          == Query Status: {querying ? "Querying" : "Not Query"} ==
        </div>
        <ul>
          <li>
            <label>
              Account Balance Of:
            </label>
            <input type="text" placeholder="address" onChange={onBalanceOf} />
            {balanceOf} FLEX
          </li>
        </ul>
      </div>
    </div>
  );
}
