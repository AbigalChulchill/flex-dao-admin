import { useEffect, useState } from "react";
import { utils } from 'ethers';
import { errorHandle } from "../../utils";

async function getBalanceOf(flexUSD, value) {
  try {
    return await flexUSD.balanceOf(value);
  } catch (err) {
    errorHandle('getBalanceOf', err);
  }
}

export function FlexUSD({ flexUSD, initialData, conn, config }) {
  const [contractName, setContractName] = useState();
  const [addr, setAddr] = useState();

  const [admin, setAdmin] = useState();
  const [name, setName] = useState();
  const [symbol, setSymbol] = useState();
  const [multiplier, setMultiplier] = useState();
  const [totalSupply, setTotalSupply] = useState();

  const [querying, setQuerying] = useState();

  const [addressBalanceOf, setAddressBalanceOf] = useState();
  const [balanceOf, setBalanceOf] = useState();

  const [txStatus, setTxStatus] = useState();
  const [txStatusText, setTxStatusText] = useState();
  const [walletAddress, setWalletAddress] = useState();

  const [amountForInitialize, setAmountForInitialize] = useState();
  const [amountForSetTotalSupply, setAmountForSetTotalSupply] = useState();

  const [addressForMint, setAddressForMint] = useState();
  const [amountForMint, setAmountForMint] = useState();

  const [addressForBurn, setAddressForBurn] = useState();
  const [amountForBurn, setAmountForBurn] = useState();
  
  useEffect(() => {
    async function fetchData() {
      try {
        if (flexUSD && initialData) {
          
          setContractName('FLEXUSD');
          setAddr(flexUSD.address);
          
          const {flexUSDAdmin,flexUSDName, flexUSDSymbol, flexUSDMultiplier, flexUSDTotalSupply} = initialData;
          if (flexUSDAdmin) setAdmin(flexUSDAdmin);
          if (flexUSDName) setName(flexUSDName);
          if (flexUSDSymbol) setSymbol(flexUSDSymbol);
          if (flexUSDMultiplier) setMultiplier(utils.formatEther(flexUSDMultiplier));
          if (flexUSDTotalSupply) setTotalSupply(utils.formatEther(flexUSDTotalSupply));

          const sender = await conn.getSigner().getAddress();
          setWalletAddress(sender);
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
  }, [flexUSD, initialData, conn, config]);

  const onBalanceOf = async (e) => {
    e.preventDefault();
    setBalanceOf(undefined);
    if (querying) return;
    setQuerying(true);
    if (flexUSD && addressBalanceOf) {
      const _balanceOf = await getBalanceOf(flexUSD, addressBalanceOf);
      if (_balanceOf) setBalanceOf(utils.formatEther(_balanceOf));
    }
    setQuerying(false);
  }

  const onInitialize = async (e) => {
    try {
      e.preventDefault();
      if (amountForInitialize) {
        setTxStatus(true);
        const amountBn = utils.parseEther(amountForInitialize);
        const gasLimitBn = await flexUSD.estimateGas.initialize(amountBn);
        const tx = await flexUSD.initialize(amountBn, {
          gasLimit: gasLimitBn,
        })
        setTxStatusText(`pending - ${tx.hash}`);
        const receipt = await tx.wait(2);
        setTxStatus(false);
        setTxStatusText(`confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
      }
    } catch (err) {
      if (typeof(err) === 'string') {
        setTxStatusText(err);
      } else {
        if (err.data && err.data.message) {
          setTxStatusText(err.data.message);
        }
        else if (err.message) {
          setTxStatusText(err.message);
          if (err.message.includes('transaction was replaced')) {
            setTxStatus(false);
          }
        }
      }
      errorHandle('onInitialize', err);
    }
  }

  const onSetTotalSupply = async (e) => {
    try {
      e.preventDefault();
      if (amountForSetTotalSupply) {
        setTxStatus(true);
        const amountBn = utils.parseEther(amountForSetTotalSupply);
        const gasLimitBn = await flexUSD.estimateGas.setTotalSupply(amountBn);
        const tx = await flexUSD.setTotalSupply(amountBn, {
          gasLimit: gasLimitBn,
        })
        setTxStatusText(`pending - ${tx.hash}`);
        const receipt = await tx.wait(2);
        setTxStatus(false);
        setTxStatusText(`confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
      }
    } catch (err) {
      if (typeof(err) === 'string') {
        setTxStatusText(err);
      } else {
        if (err.data && err.data.message) {
          setTxStatusText(err.data.message);
        }
        else if (err.message) {
          setTxStatusText(err.message);
          if (err.message.includes('transaction was replaced')) {
            setTxStatus(false);
          }
        }
      }
      errorHandle('onSetTotalSupply', err);
    }
  }

  const onMint = async (e) => {
    try {
      e.preventDefault();
      if (addressForMint && amountForMint) {
        setTxStatus(true);
        const amountBn = utils.parseEther(amountForMint);
        const gasLimitBn = await flexUSD.estimateGas.mint(addressForMint, amountBn);
        const tx = await flexUSD.mint(addressForMint, amountBn, {
          gasLimit: gasLimitBn,
        })
        setTxStatusText(`pending - ${tx.hash}`);
        const receipt = await tx.wait(2);
        setTxStatus(false);
        setTxStatusText(`confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
      }
    } catch (err) {
      if (typeof(err) === 'string') {
        setTxStatusText(err);
      } else {
        if (err.data && err.data.message) {
          setTxStatusText(err.data.message);
        }
        else if (err.message) {
          setTxStatusText(err.message);
          if (err.message.includes('transaction was replaced')) {
            setTxStatus(false);
          }
        }
      }
      errorHandle('onMint', err);
    }
  }

  const onBurn = async (e) => {
    try {
      e.preventDefault();
      if (addressForBurn && amountForBurn) {
        setTxStatus(true);
        const amountBn = utils.parseEther(amountForBurn);
        const gasLimitBn = await flexUSD.estimateGas.burn(addressForBurn, amountBn);
        const tx = await flexUSD.burn(addressForBurn, amountBn, {
          gasLimit: gasLimitBn,
        })
        setTxStatusText(`pending - ${tx.hash}`);
        const receipt = await tx.wait(2);
        setTxStatus(false);
        setTxStatusText(`confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
      }
    } catch (err) {
      if (typeof(err) === 'string') {
        setTxStatusText(err);
      } else {
        if (err.data && err.data.message) {
          setTxStatusText(err.data.message);
        }
        else if (err.message) {
          setTxStatusText(err.message);
          if (err.message.includes('transaction was replaced')) {
            setTxStatus(false);
          }
        }
      }
      errorHandle('onBurn', err);
    }
  }

  return (
    <div className="box">
      <div className="info">
        <div className="bulletin">
          == Contract Name: {contractName} - <a href={config.explorer + config.flexusd} target="_blank" rel="noreferrer" >Check on Explorer </a> - <a href={config.chain_id === "1"? "/ABI/FlexUSDEth.json" : "/ABI/FlexUSDImplV2.json"} target="_blank" rel="noreferrer" >Logic ABI</a> - <a href={config.chain_id === "1"? "/ABI/FlexUSDEthProx.json" : "/ABI/FlexUSD.json"} target="_blank" rel="noreferrer" >Proxy ABI</a> ==
        </div>
        <ul>
          <li>Addr: {addr}</li>
          <li>Admin: {admin}</li>
          <li>Name: {name}</li>
          <li>Symbol: {symbol}</li>
          <li>Multiplier: {multiplier}</li>
          <li>Total Supply: {totalSupply} FlexUSD</li>
        </ul>
      </div>
      <div className="query">
        <div className={"status-" + (querying ? "on" : "off")}>
          == Query Status: {querying ? "Querying" : "Not Query"} ==
        </div>
        <ul>
          <li>
            <form>
              <label>
                Account Balance Of:
              </label>
              <input type="text" placeholder="address" size="50" onChange={ e => setAddressBalanceOf(e.target.value)} />
              <button onClick={onBalanceOf}>Read</button>
              <span>{balanceOf} {balanceOf ? 'FlexUSD' : ''}</span>
            </form>
          </li>
        </ul>
      </div>
      <div className="query">
        <div className={"status-" + (txStatus ? "on" : "off")}>
          == Tx Status: {txStatusText} ==
        </div>
        <ul>
          <p>Connected wallet: {walletAddress}</p>
          <p></p>
          <li>
            <form>
              <label>
                initialize:
              </label>
              <input type="text" placeholder="amount (ETH Unit)" onChange={e=>setAmountForInitialize(e.target.value)} />
              <button onClick={onInitialize}>Write</button>
            </form>
          </li>
          <li>
            <form>
              <label>
                setTotalSupply:
              </label>
              <input type="text" placeholder="amount (ETH Unit)" onChange={e=>setAmountForSetTotalSupply(e.target.value)} />
              <button onClick={onSetTotalSupply}>Write</button>
            </form>
          </li>
          <li>
            <form>
              <label>
                mint:
              </label>
              <input type="text" placeholder="address" size="50" onChange={e=>setAddressForMint(e.target.value)} />
              <input type="text" placeholder="amount (ETH Unit)" onChange={e=>setAmountForMint(e.target.value)} />
              <button onClick={onMint}>Write</button>
            </form>
          </li>
          <li>
            <form>
              <label>
                burn:
              </label>
              <input type="text" placeholder="address" size="50" onChange={e=>setAddressForBurn(e.target.value)} />
              <input type="text" placeholder="amount (ETH Unit)" onChange={e=>setAmountForBurn(e.target.value)} />
              <button onClick={onBurn}>Write</button>
            </form>
          </li>
        </ul>
      </div>
    </div>
  );
}
