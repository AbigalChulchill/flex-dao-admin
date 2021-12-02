import { useEffect, useState } from "react";
import { errorHandle } from "../utils";

async function getBalanceOf(flex, value) {
  try {
    return await flex.balanceOf(Number(value));
  } catch (err) {
    errorHandle('getBalanceOf', err);
  }
}

export function FLEX({ flex }) {

  const [querying, setQuerying] = useState();

  const [name, setName] = useState();
  const [addr, setAddr] = useState();

  const [balanceOf, setBalanceOf] = useState();

  useEffect(() => {
    async function fetchData() {
      if (flex) {
        setName('FLEX');

        setAddr(flex.address);
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
        </ul>
      </div>
      <div className="query">
        <div className="status">
          == Query Status: {querying ? "Querying" : "Not Query"} ==
        </div>
        <ul>
          <li>
            <label>
              account balance of:
            </label>
            <input type="text" onChange={onBalanceOf} />
            {balanceOf} FLEX
          </li>
        </ul>
      </div>
    </div>
  );
}
