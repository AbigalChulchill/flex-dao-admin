import { getFlexPP, getTransferTokenPP } from '../conn';
import { ConnectionContext} from '../App'
import { FLEX } from "../components/contracts/FLEX";
import { useEffect, useState, useContext } from "react";

export const FlexPPPage = () => {
  const { conn } = useContext(ConnectionContext);

  const [flex, setFlex] = useState();
  const [transferToken, setTransferToken] = useState();

  useEffect(() => {
    async function fetchData() {
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
      }
    }
    fetchData();
    return () => {
      setFlex();
    }
  }, [conn]);

  return (
    <>
      <h1>FLEX PP Admin Page</h1>
      <div className="container">
        <FLEX flex={flex} enableTx={true} conn={conn} transferToken={transferToken}></FLEX>
      </div>
    </>
  )
}