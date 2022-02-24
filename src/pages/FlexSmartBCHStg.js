import { getFlexStg2, getTransferTokenStg2, getMultiCallStg2, getMultiCallFlexStg2, getMultiCallTransferTokenStg2 } from '../conn';
import { ConnectionContext} from '../App'
import { FLEX } from "../components/contracts/FLEX";
import { useEffect, useState, useContext } from "react";

import { errorHandle } from "../utils";

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
    errorHandle('initialDataForPage', err);
  }
}


export const FlexSmartBCHStg = () => {
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
          const _flex = getFlexStg2(conn);
          if (_flex) setFlex(_flex);
          const _transferToken = getTransferTokenStg2(conn);
          if (_transferToken) setTransferToken(_transferToken);
          const _multiCall = await getMultiCallStg2(conn);
          const _multiCallFlex = getMultiCallFlexStg2();
          const _multiCallTransferToken = getMultiCallTransferTokenStg2();
          if (_multiCall && _multiCallFlex && _multiCallTransferToken) {
            const _initialData = await initialDataForPage(_multiCall, _multiCallFlex, _multiCallTransferToken);
            if (_initialData) setInitialData(_initialData);
          }
        }
      } catch (err) {
        errorHandle("initial FLEX Stg2 page", err);
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
      <div className="container">
        <FLEX flex={flex} enableTx={true} conn={conn} transferToken={transferToken} initialData={initialData}></FLEX>
      </div>
    </>
  )
}