import { useEffect, useState } from "react";
import { errorHandle } from "../../utils";

async function getAdmin(distributor) {
  try {
    return await distributor.admin();
  } catch (err) {
    errorHandle('getAdmin', err);
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

export function DistributorStg1({ distributor }) {

  const [querying] = useState();

  const [addr, setAddr] = useState();
  const [admin, setAdmin] = useState();

  const [token, setToken] = useState();
  const [payout, setPayout] = useState();

  useEffect(() => {
    async function fetchData() {
      if (distributor) {
        setAddr(distributor.address);

        const _admin = await getAdmin(distributor);
        if (_admin) setAdmin(_admin);

        const _token = await getToken(distributor);
        if (_token) setToken(_token);

        const _payout = await getPayout(distributor);
        if (_payout) setPayout(_payout);
      }
    }
    fetchData();
  }, [distributor]);

  return (
    <div className="box">
      <div className="info">
        <div className="bulletin">
          == Basic Info ==
        </div>
        <ul>
          <li>Contract Name: Daily Payout Distributor</li>
          <li>Contract Addr: {addr}</li>
          <li>Contract Admin: {admin}</li>
          <li>FLEX Addr: {token}</li>
          <li>Payout Addr: {payout} FLEX</li>
        </ul>
      </div>
      <div className="query">
        <div className="status">
          == Query Status: {querying ? "Querying" : "Not Query"} ==
        </div>
        <ul>
        </ul>
      </div>
    </div>
  );
}
