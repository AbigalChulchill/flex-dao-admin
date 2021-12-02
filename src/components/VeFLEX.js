import { useEffect, useState } from "react";
import { utils } from "ethers";
import {errorHandle } from "../utils";

async function getToken(veflex) {
  try {
    return await veflex.token();
  } catch(err) {
    errorHandle('getToken', err);
  }
}

async function getSupply(veflex) {
  try {
    return await veflex.supply();
  } catch(err) {
    errorHandle('getSupply', err);
  }
}

async function getLocked(veflex, value) {
  try {
    return await veflex.locked(value);
  } catch(err) {
    errorHandle('getLocked', err);
  }
}


export function VeFLEX({veflex}) {

  const [querying, setQuerying] = useState();

  const [name, setName] = useState();
  const [addr, setAddr] = useState();
  
  const [token, setToken] = useState();
  const [supply, setSupply] = useState();
  
  const [locked, setLocked] = useState();
  
  // const [totalSupply, setTotalSupply] = useState();
  // const [totalSupplyAt, setTotalSupplyAt] = useState();
  // const [balanceOf, setBalanceOf] = useState();
  // const [balanceOfAt, setBalanceOfAt] = useState();
  
  useEffect( () => {
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
          == Query Status: {querying? "Querying": "Not Query"} ==
        </div>
        <ul>
          <li>
            <label>
              Stake Detail for address:
            </label>
            <input type="text" onChange={onLocked} />
              {locked? `staked ${locked[0]} FLEX, end at: ${new Date(locked[1] * 1000).toLocaleString()} Local Time`: "" }
          </li>
        </ul>
      </div>
    </div>
  );
}
