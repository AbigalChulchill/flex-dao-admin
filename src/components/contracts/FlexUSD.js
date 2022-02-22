import { useEffect, useState } from "react";
import { utils } from 'ethers';
import { errorHandle } from "../../utils";

import * as config from "../../config.json";

export function FlexUSD({ flexUSD, initialData}) {
  const [name, setName] = useState();
  const [addr, setAddr] = useState();
  const [admin, setAdmin] = useState();
  const [totalSupply, setTotalSupply] = useState();
  
  useEffect(() => {
    async function fetchData() {
      try {
        if (flexUSD && initialData) {
          
          setName('FLEXUSD');
          setAddr(flexUSD.address);
          
          const {flexUSDAdmin,flexUSDTotalSupply} = initialData;
          if (flexUSDAdmin) setAdmin(flexUSDAdmin);
          if (flexUSDTotalSupply) setTotalSupply(utils.formatEther(flexUSDTotalSupply));
        }
      } catch (err) {
        errorHandle('flexUSD initial', err);
      }
    }
    fetchData();
    return () => {
      setName();
      setAddr();
      setAdmin();
      setTotalSupply();
    }
  }, [flexUSD, initialData]);

  return (
    <div className="box">
      <div className="info">
        <div className="bulletin">
          == Contract Name: {name} - <a href={config.flexusd.avax.pp.url} target="_blank" rel="noreferrer" >Check on explorer</a> ==
        </div>
        <ul>
          <li>Contract Addr: {addr}</li>
          <li>Contract Admin: {admin}</li>
          <li>Total Supply: {totalSupply} FLEXUSD</li>
        </ul>
      </div>      
    </div>
  );
}
