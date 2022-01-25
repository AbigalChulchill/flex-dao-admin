import { getFlexPP, getTransferTokenPP, getMultiCallPP, getMultiCallFlexPP } from '../conn';
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

export const FlexPPPage = () => {
  const { conn } = useContext(ConnectionContext);

  const [flex, setFlex] = useState();
  const [transferToken, setTransferToken] = useState();
  const [initialData, setInitialData] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const ethereum = window.ethereum;
        if (ethereum.networkVersion !== '10001') {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: '0x2711' }],
          });
        }
        if (conn) {
          const _flex = getFlexPP(conn);
          if (_flex) setFlex(_flex);
          const _transferToken = getTransferTokenPP(conn);
          if (_transferToken) setTransferToken(_transferToken);
          const _multiCall = await getMultiCallPP(conn);
          const _multiCallFlex = getMultiCallFlexPP();
          if (_multiCall && _multiCallFlex) {
            const _initialData = await initialDataForPage(_multiCall, _multiCallFlex);
            if (_initialData) setInitialData(_initialData);
          }
        }
      } catch (err) {
        errorHandle("initial FLEX PP page", err);
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
      <h1>FLEX PP Admin Page</h1>
      <div className="container">
        <FLEX flex={flex} enableTx={true} conn={conn} transferToken={transferToken} initialData={initialData}></FLEX>
      </div>
    </>
  )
}