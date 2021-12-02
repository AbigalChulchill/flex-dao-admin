import { useEffect, useState } from "react";
import { errorHandle } from "../utils";

async function getName(distributor) {
  try {
    return await distributor.name();
  } catch (err) {
    errorHandle('getName', err);
  }
}

async function getToken(distributor) {
  try {
    return await distributor.flex();
  } catch (err) {
    errorHandle('getToken', err);
  }
}

async function getPayout(distributor) {
  try {
    return await distributor.payout();
  } catch (err) {
    errorHandle('getPayout', err);
  }
}

async function getIsDistributor(distributor, value) {
  try {
    const _isDistributor = await distributor.isDistributor(value);
    return _isDistributor ? "YES" : "NO";
  } catch (err) {
    errorHandle('getIsDistributor', err);
  }
}

export function Distributor({ distributor }) {

  const [querying, setQuerying] = useState();

  const [name, setName] = useState();
  const [addr, setAddr] = useState();

  const [token, setToken] = useState();
  const [payout, setPayout] = useState();

  const [isDistributor, setIsDistributor] = useState();

  useEffect(() => {
    async function fetchData() {
      if (distributor) {
        const _name = await getName(distributor);
        if (_name) setName(_name);

        setAddr(distributor.address);

        const _token = await getToken(distributor);
        if (_token) setToken(_token);

        const _payout = await getPayout(distributor);
        if (_payout) setPayout(_payout);
      }
    }
    fetchData();
  }, [distributor]);

  const onIsDistributor = async (e) => {
    setIsDistributor(undefined);
    if (querying) return;
    setQuerying(true);
    const value = e.target.value;
    if (distributor && value) {
      const _isDistributor = await getIsDistributor(distributor, value);
      if (_isDistributor) setIsDistributor(_isDistributor);
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
          <li>Payout addr: {payout} FLEX</li>
        </ul>
      </div>
      <div className="query">
        <div className="status">
          == Query Status: {querying ? "Querying" : "Not Query"} ==
        </div>
        <ul>
          <li>
            <label>
              Is distributor:
            </label>
            <input type="text" onChange={onIsDistributor} />
            {isDistributor}
          </li>
        </ul>
      </div>
    </div>
  );
}
