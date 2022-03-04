import { useEffect, useState, useContext } from "react";
import { Contract } from 'ethers';
import { Provider as MultiCallProvider, Contract as MultiCallContract, setMulticallAddress } from 'ethers-multicall';

import { ConnectionContext} from '../../App';

import { FLEX } from "../contracts/FLEX";

import * as FlexABI from '../../contracts/FLEXCoin.json'
import * as TransferTokenABI from '../../contracts/TransferToken.json'

import { errorHandle } from "../../utils";

const initialDataForPage = async (multiCall, multiCallFlex, multiCallTransferToken) => {
  try {
    const getFlexAdmin = multiCallFlex.owner();
    const getFlexTotalSupply = multiCallFlex.totalSupply();
    const getTransferAdmin = multiCallTransferToken.owner();

    const [flexAdmin, 
      flexTotalSupply,
      transferTokenAdmin
    ] = await multiCall.all([getFlexAdmin,
                          getFlexTotalSupply,
                          getTransferAdmin
                        ]);
    return {
      flexAdmin, 
      flexTotalSupply,
      transferTokenAdmin
    }
  } catch (err) {
    errorHandle('flex initialDataForPage', err);
  }
}

const getFlex = (config, conn) => {
  return new Contract(config.flex, FlexABI.abi, conn.getSigner());
}

const getTransferToken = (config, conn) => {
  return new Contract(config.transfer_token, TransferTokenABI.abi, conn.getSigner());
}

const getMultiCall = async (config, conn) => {
  setMulticallAddress(config.chain_id, config.multi_call);
  const callProvider = new MultiCallProvider(conn, config.chain_id);
  return callProvider;
}

const getMultiCallFlex = (config) => {
  return new MultiCallContract(config.flex, FlexABI.abi);
}

const getMultiCallTransferToken = (config) => {
  return new MultiCallContract(config.transfer_token, TransferTokenABI.abi);
}

export const FlexTpl = ( {config}) => {
  const { conn } = useContext(ConnectionContext);

  const [flex, setFlex] = useState();
  const [transferToken, setTransferToken] = useState();
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
        if (conn && config) {
          const _flex = getFlex(config, conn);
          if (_flex) setFlex(_flex);

          const _transferToken = getTransferToken(config, conn);
          if (_transferToken) setTransferToken(_transferToken);

          const _multiCall = await getMultiCall(config, conn);
          const _multiCallFlex = getMultiCallFlex(config);
          const _multiCallTransferToken = getMultiCallTransferToken(config);
          if (_multiCall && _multiCallFlex && _multiCallTransferToken) {
            const _initialData = await initialDataForPage(_multiCall, _multiCallFlex, _multiCallTransferToken);
            if (_initialData) setInitialData(_initialData);
          }
        }
      } catch (err) {
        errorHandle(`initial ${config.name} page`, err);
      }
    }
    fetchData();
    return () => {
      setFlex();
      setTransferToken();
    }
  }, [config, conn]);

  return (
    <>
      <h1>{config.name} @ {config.network_name}</h1>
      <div className="container">
        <FLEX flex={flex} enableTx={true} conn={conn} transferToken={transferToken} initialData={initialData} config={config}></FLEX>
      </div>
    </>
  )
}