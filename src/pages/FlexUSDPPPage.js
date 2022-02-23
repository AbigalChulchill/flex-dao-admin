import { getFlexUSDAvaxPP, getMultiCallAvaxPP, getMultiCallFlexUSDAvaxPP } from '../conn';
import * as config from '../config.json'
import { ConnectionContext} from '../App'
import { FlexUSD } from "../components/contracts/FlexUSD";
import { useEffect, useState, useContext } from "react";

import { errorHandle } from "../utils";

const initialDataForPage = async (multiCall, multiCallFlexUSD) => {
  try {
    const getFlexUSDAdmin = multiCallFlexUSD.owner();
    const getFlexUSDName = multiCallFlexUSD.name();
    const getFlexUSDSymbol = multiCallFlexUSD.symbol();
    const getFlexUSDMultiplier = multiCallFlexUSD.multiplier();
    const getFlexUSDTotalSupply = multiCallFlexUSD.totalSupply();

    const [flexUSDAdmin,
      flexUSDName,
      flexUSDSymbol,
      flexUSDMultiplier,
      flexUSDTotalSupply
    ] = await multiCall.all([getFlexUSDAdmin,
                            getFlexUSDName,
                            getFlexUSDSymbol,
                            getFlexUSDMultiplier,
                            getFlexUSDTotalSupply
                        ]);
    return {
      flexUSDAdmin,
      flexUSDName,
      flexUSDSymbol,
      flexUSDMultiplier,
      flexUSDTotalSupply
    }
  } catch (err) {
    errorHandle('initialDataForPage', err);
  }
}

export const FlexUSDPPPage = () => {
  const { conn } = useContext(ConnectionContext);

  const [flexUSD, setFlexUSD] = useState();
  const [initialData, setInitialData] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const ethereum = window.ethereum;
        if (ethereum.networkVersion !== config.flexusd.avax.pp.chain_id) {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x" + Number(config.flexusd.avax.pp.chain_id).toString(16) }],
          });
        }
        if (conn) {
          const _flexUSD = getFlexUSDAvaxPP(conn);
          if (_flexUSD) setFlexUSD(_flexUSD);
   
          const _multiCall = await getMultiCallAvaxPP(conn);
          const _multiCallFlexUSD = getMultiCallFlexUSDAvaxPP();
          if (_multiCall && _multiCallFlexUSD) {
            const _initialData = await initialDataForPage(_multiCall, _multiCallFlexUSD);
            if (_initialData) setInitialData(_initialData);
          }
        }
      } catch (err) {
        errorHandle("initial FLEXUSD PP page", err);
      }
    }
    fetchData();
    return () => {
      setFlexUSD();
    }
  }, [conn]);

  return (
    <>
      <h1>FLEXUSD PP Admin Page</h1>
      <h3>{config.flexusd.avax.pp.network_name}</h3>
      <div className="container">
        <FlexUSD flexUSD={flexUSD} initialData={initialData} conn={conn}></FlexUSD>
      </div>
    </>
  )
}