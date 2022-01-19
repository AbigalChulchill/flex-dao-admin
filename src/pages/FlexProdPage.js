import { getFlexProd } from '../conn';
import { ConnectionContext} from '../App'
import { FLEX } from "../components/contracts/FLEX";
import { useEffect, useState, useContext } from "react";

export const FlexProdPage = () => {
  const { conn } = useContext(ConnectionContext);
  
  const [flex, setFlex] = useState();

  useEffect(() => {
    async function fetchData() {
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
      }
    }
    fetchData();
    return () => {
      setFlex();
    }
  }, [conn]);

  return (
    <>
      <h1>FLEX Prod Admin Page</h1>
      <div className="container">
        <FLEX flex={flex} enableTx={true} conn={conn}></FLEX>
      </div>
    </>
  )
}