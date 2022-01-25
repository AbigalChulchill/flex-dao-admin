import { getFlexProd, getTransferTokenProd, getMultiCallProd, getMultiCallFlexProd } from '../conn';
import { ConnectionContext} from '../App'
import { FLEX } from "../components/contracts/FLEX";
import { useEffect, useState, useContext } from "react";

import { errorHandle } from "../utils";

const initialDataForPage = async (multiCall, multiCallFlex) => {
  try {
    const getFlexAdmin = multiCallFlex.owner();
    const getFlexTotalSupply = multiCallFlex.totalSupply();

    const [flexAdmin, 
      flexTotalSupply,
    ] = await multiCall.all([getFlexAdmin,
                          getFlexTotalSupply
                        ]);
    return {
      flexAdmin, 
      flexTotalSupply
    }
  } catch (err) {
    errorHandle('initialDataForPage', err);
  }
}

export const FlexProdPage = () => {
  const { conn } = useContext(ConnectionContext);
  
  const [flex, setFlex] = useState();
  const [transferToken, setTransferToken] = useState();
  const [initialData, setInitialData] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const ethereum = window.ethereum;
        if (ethereum.networkVersion !== '10000') {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: '0x2710' }],
          });
        }
        if (conn) {
          const _flex = getFlexProd(conn);
          if (_flex) setFlex(_flex);
          const _transferToken = getTransferTokenProd(conn);
          if (_transferToken) setTransferToken(_transferToken);
          const _multiCall = await getMultiCallProd(conn);
          const _multiCallFlex = getMultiCallFlexProd();
          if (_multiCall && _multiCallFlex) {
            const _initialData = await initialDataForPage(_multiCall, _multiCallFlex);
            if (_initialData) setInitialData(_initialData);
          }
        }
      } catch (err) {
        errorHandle("initial FLEX Prod page", err);
      }
    }
    fetchData();
    return () => {
      setFlex();
      setTransferToken();
    }
  }, [conn]);

  return (
    <>
      <h1>FLEX Prod Admin Page</h1>
      <div className="container">
        <FLEX flex={flex} enableTx={true} conn={conn} transferToken={transferToken} initialData={initialData}></FLEX>
      </div>
    </>
  )
}