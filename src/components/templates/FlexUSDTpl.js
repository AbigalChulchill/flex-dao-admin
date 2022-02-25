import { useEffect, useState, useContext } from "react";
import { Contract } from 'ethers';
import { Provider as MultiCallProvider, Contract as MultiCallContract, setMulticallAddress } from 'ethers-multicall';

import { ConnectionContext} from '../../App';

import { FlexUSD } from "../contracts/FlexUSD";

import * as FlexUSDABI from '../../contracts/FlexUSDImplV2.json'

import { errorHandle } from "../../utils";

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

const getFlexUSD = (config, conn) => {
  return new Contract(config.flexusd, FlexUSDABI.abi, conn.getSigner());
}

const getMultiCall = async (config, conn) => {
  setMulticallAddress(config.chain_id, config.multi_call);
  const callProvider = new MultiCallProvider(conn, config.chain_id);
  return callProvider;
}

const getMultiCallFlexUSD = (config) => {
  return new MultiCallContract(config.flexusd, FlexUSDABI.abi);
}

export const FlexUSDTpl = ( {config} ) => {
  const { conn } = useContext(ConnectionContext);

  const [flexUSD, setFlexUSD] = useState();
  const [initialData, setInitialData] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const ethereum = window.ethereum;
        if (ethereum.networkVersion !== config.chain_id) {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x" + Number(config.chain_id).toString(16) }],
          });
        }
        if (conn) {
          const _flexUSD = getFlexUSD(config, conn);
          if (_flexUSD) setFlexUSD(_flexUSD);
   
          const _multiCall = await getMultiCall(config, conn);
          const _multiCallFlexUSD = getMultiCallFlexUSD(config);
          if (_multiCall && _multiCallFlexUSD) {
            const _initialData = await initialDataForPage(_multiCall, _multiCallFlexUSD);
            if (_initialData) setInitialData(_initialData);
          }
        }
      } catch (err) {
        errorHandle(`initial ${config.name} page`, err);
      }
    }
    fetchData();
    return () => {
      setFlexUSD();
    }
  }, [config, conn]);

  return (
    <>
      <h1>{config.name} @ {config.network_name}</h1>
      <div className="container">
        <FlexUSD flexUSD={flexUSD} initialData={initialData} conn={conn} config={config}></FlexUSD>
      </div>
    </>
  )
}