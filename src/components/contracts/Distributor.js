import { useEffect, useState } from "react";
import { utils } from 'ethers';
import { errorHandle,  } from "../../utils";

async function getIsDistributor(distributor, value) {
  try {
    const _isDistributor = await distributor.isDistributor(value);
    return _isDistributor ? "YES" : "NO";
  } catch (err) {
    errorHandle('getIsDistributor', err);
  }
}

async function getFlexBalance(flex, address) {
  try {
    return await flex.balanceOf(address);
  } catch (err) {
    errorHandle('getFlexBalance', err);
  }
}

export function Distributor({ distributor, flex, initialData, config }) {

  const [querying, setQuerying] = useState();

  const [name, setName] = useState();
  const [addr, setAddr] = useState();
  const [admin, setAdmin] = useState();

  const [token, setToken] = useState();
  const [balance, setBalance] = useState();
  const [payout, setPayout] = useState();

  const [addressIsDistributor, setAddressIsDistributor] = useState();
  const [isDistributor, setIsDistributor] = useState();

  useEffect(() => {
    async function fetchData() {
      if (distributor && initialData) {

        setAddr(distributor.address);

        const {dailyDistributorAdmin, dailyDistributorName, dailyDistributorToken, dailyDistributorPayout} = initialData;
        if (dailyDistributorAdmin) setAdmin(dailyDistributorAdmin);
        if (dailyDistributorName) setName(dailyDistributorName);
        if (dailyDistributorToken) setToken(dailyDistributorToken);
        if (dailyDistributorPayout) setPayout(dailyDistributorPayout);
        const _balance = await getFlexBalance(flex, distributor.address);
        if (_balance) setBalance(utils.formatEther(_balance));
      }
    }
    fetchData();
    return () => {
      setName();
      setAddr();
      setAdmin();
      setToken();
      setBalance();
      setPayout();
    }
  }, [distributor, flex, initialData, config]);

  const onIsDistributor = async (e) => {
    e.preventDefault();
    setIsDistributor(undefined);
    if (querying) return;
    setQuerying(true);
    if (distributor && addressIsDistributor) {
      const _isDistributor = await getIsDistributor(distributor, addressIsDistributor);
      if (_isDistributor) setIsDistributor(_isDistributor);
    }
    setQuerying(false);
  }

  return (
    <div className="box">
      <div className="info">
        <div className="bulletin">
          == Contract Name: {name} - <a href={config.explorer + config.daily_mini_distributor} target="_blank" rel="noreferrer" >Check on Explorer </a>==
        </div>
        <ul>
          <li>Contract Addr: {addr}</li>
          <li>Contract Admin: {admin}</li>
          <li>FLEX Addr: {token}</li>
          <li>Contract FLEX balance: {balance} FLEX</li>
          <li>Payout Addr: {payout}</li>
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
                Is Distributor:
              </label>
              <input type="text" placeholder="address" size="50" onChange={e=>setAddressIsDistributor(e.target.value)} />
              <button onClick={onIsDistributor}>Read</button>
              <span>{isDistributor}</span>
            </form>
          </li>
        </ul>
      </div>
    </div>
  );
}
