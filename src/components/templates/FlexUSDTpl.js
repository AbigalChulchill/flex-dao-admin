import { useEffect, useState, useContext } from "react";
import { Contract } from 'ethers';
import { Provider as MultiCallProvider, Contract as MultiCallContract, setMulticallAddress } from 'ethers-multicall';

import { GlobalContext} from '../../App';

import { FlexUSD } from "../contracts/FlexUSD";

import * as FlexUSDABI from "../../contracts/FlexUSDImplV2.json";
import * as FlexUSDEthABI from "../../contracts/FlexUSDEth.json";

import { errorHandle } from "../../utils";

const initialDataForPage = async (multiCall, multiCallFlexUSD, config) => {
  try {
    let getFlexUSDAdmin;
    if (config.chain_id === "1") {
      getFlexUSDAdmin = multiCallFlexUSD.admin();
    } else {
      getFlexUSDAdmin = multiCallFlexUSD.owner();
    }
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
    errorHandle('flexusd initialDataForPage', err);
  }
}

const getFlexUSD = (config, conn) => {
  if (config.chain_id === "1") {
    return new Contract(config.flexusd, FlexUSDEthABI.abi, conn.getSigner());
  } else {
    return new Contract(config.flexusd, FlexUSDABI.abi, conn.getSigner());
  }
}

const getMultiCall = async (config, conn) => {
  setMulticallAddress(config.chain_id, config.multi_call);
  const callProvider = new MultiCallProvider(conn, config.chain_id);
  return callProvider;
}

const getMultiCallFlexUSD = (config) => {
  if (config.chain_id === "1") {
    return new MultiCallContract(config.flexusd, FlexUSDEthABI.abi);
  } else {
    return new MultiCallContract(config.flexusd, FlexUSDABI.abi);
  }
}

export const FlexUSDTpl = ( {config} ) => {
  const { conn } = useContext(GlobalContext);

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
          if (_multiCall && _multiCallFlexUSD && config) {
            const _initialData = await initialDataForPage(_multiCall, _multiCallFlexUSD, config);
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
      <div className="container">
        <h1>{config.name} @ {config.network_name}</h1>
        <FlexUSD flexUSD={flexUSD} initialData={initialData} conn={conn} config={config}></FlexUSD>
      </div>
    </>
  )
}