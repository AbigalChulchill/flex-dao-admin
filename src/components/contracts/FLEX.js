import { useEffect, useState } from "react";
import { utils } from 'ethers';
import { errorHandle } from "../../utils";

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

  const [addressBalanceOf, setAddressBalanceOf] = useState();
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
    return () => {
      setName();
      setAddr();
      setAdmin();
      setTotalSupply();
    }
  }, [flex]);

  const onBalanceOf = async (e) => {
    e.preventDefault();
    setBalanceOf(undefined);
    if (querying) return;
    setQuerying(true);
    if (flex && addressBalanceOf) {
      const _balanceOf = await getBalanceOf(flex, addressBalanceOf);
      if (_balanceOf) setBalanceOf(utils.formatEther(_balanceOf));
    }
    setQuerying(false);
  }

  return (
    <div className="box">
      <div className="info">
        <div className="bulletin">
          == Contract Name: {name} ==
        </div>
        <ul>
          <li>Contract Addr: {addr}</li>
          <li>Contract Admin: {admin}</li>
          <li>Total Supply: {totalSupply} FLEX</li>
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
                Account Balance Of:
              </label>
              <input type="text" placeholder="address" size="45" onChange={ e => setAddressBalanceOf(e.target.value)} />
              <button onClick={onBalanceOf}>Read</button>
              <span>{balanceOf} {balanceOf ? 'FLEX' : ''}</span>
            </form>
          </li>
        </ul>
      </div>
    </div>
  );
}
