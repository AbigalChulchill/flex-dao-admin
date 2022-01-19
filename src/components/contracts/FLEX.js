import { useEffect, useState } from "react";
import { utils } from 'ethers';
import { errorHandle } from "../../utils";

async function getAdmin(flex) {
  try {
    return await flex.owner();
  } catch (err) {
    errorHandle('getAdmin', err);
  }
}

async function getTotalSupply(flex) {
  try {
    return await flex.totalSupply();
  } catch (err) {
    errorHandle('getTotalSupply', err);
  }
}

async function getBalanceOf(flex, value) {
  try {
    return await flex.balanceOf(value);
  } catch (err) {
    errorHandle('getBalanceOf', err);
  }
}

export function FLEX({ flex, enableTx, conn }) {

  const [querying, setQuerying] = useState();

  const [name, setName] = useState();
  const [addr, setAddr] = useState();
  const [admin, setAdmin] = useState();
  const [totalSupply, setTotalSupply] = useState();

  const [addressBalanceOf, setAddressBalanceOf] = useState();
  const [balanceOf, setBalanceOf] = useState();

  const [txStatus, setTxStatus] = useState();
  const [txStatusText, setTxStatusText] = useState();
  const [walletAddress, setWalletAddress] = useState();

  const [addressForSimpleSend, setAddressForSimpleSend] = useState();
  const [amountForSimpleSend, setAmountForSimpleSend] = useState();
  const [currencyForSimpleSend, setCurrencyForSimpleSend] = useState();

  useEffect(() => {
    async function fetchData() {
      if (flex) {

        if (enableTx) {
          const sender = await conn.getSigner().getAddress();
          setWalletAddress(sender);
        }

        setName('FLEX');
        setAddr(flex.address);

        const _admin = await getAdmin(flex);
        if (_admin) setAdmin(_admin);

        const _totalSupply = await getTotalSupply(flex);
        if (_totalSupply) setTotalSupply(utils.formatEther(_totalSupply));
      }
    }
    fetchData();
    return () => {
      setName();
      setAddr();
      setAdmin();
      setTotalSupply();
    }
  }, [flex, enableTx, conn]);

  const onBalanceOf = async (e) => {
    e.preventDefault();
    setBalanceOf(undefined);
    if (querying) return;
    setQuerying(true);
    if (flex && addressBalanceOf) {
      const _balanceOf = await getBalanceOf(flex, addressBalanceOf);
      if (_balanceOf) setBalanceOf(utils.formatEther(_balanceOf));
    }
    setQuerying(false);
  }

  const onSimpleSending = async (e) => {
    try {
      e.preventDefault();
      if (addressForSimpleSend && amountForSimpleSend && currencyForSimpleSend && !txStatus) {
        setTxStatus(true);
        const amountBn = utils.parseEther(amountForSimpleSend);
        let gasLimitBn;
        if (currencyForSimpleSend === 'flex') {
          gasLimitBn = await flex.estimateGas.transfer(addressForSimpleSend, amountBn);
          const tx = await flex.transfer(addressForSimpleSend, amountBn, {
            gasLimit: gasLimitBn,
            gasPrice: utils.parseUnits('1.05', 'gwei')
          })
          setTxStatusText(`pending - ${tx.hash}`);
          tx.wait(2).then((receipt) => {
            setTxStatus(false);
            setTxStatusText(`confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
          })
        } else if (currencyForSimpleSend === 'bch') {
          const signer = conn.getSigner();
          const tx = await signer.sendTransaction({
            to: addressForSimpleSend,
            value: amountBn,
            gasPrice: utils.parseUnits('1.05', 'gwei')
          })
          setTxStatusText(`pending - ${tx.hash}`);
          tx.wait(2).then((receipt) => {
            setTxStatus(false);
            setTxStatusText(`confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
          })
        }
      }
    } catch (err) {
      errorHandle('onSimpleSending', err);
    }
  }

  return (
    <div className="box">
      <div className="info">
        <div className="bulletin">
          == Contract Name: {name} ==
        </div>
        <ul>
          <li>Contract Addr: {addr}</li>
          <li>Contract Admin: {admin}</li>
          <li>Total Supply: {totalSupply} FLEX</li>
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
              <input type="text" placeholder="address" size="45" onChange={ e => setAddressBalanceOf(e.target.value)} />
              <button onClick={onBalanceOf}>Read</button>
              <span>{balanceOf} {balanceOf ? 'FLEX' : ''}</span>
            </form>
          </li>
        </ul>
      </div>
      
      { enableTx && 
        <div className="query">
          <div className={"status-" + (txStatus ? "on" : "off")}>
            == Tx Status: {txStatusText} ==
          </div>
          <ul>
            <p>Connected wallet: {walletAddress}</p>
            <li>
              <form>
                <label>
                  Simple Sending:
                </label>
                <input type="text" placeholder="address" size="45" onChange={e=>setAddressForSimpleSend(e.target.value)} />
                <input type="text" placeholder="amount (ETH unit)" onChange={e=>setAmountForSimpleSend(e.target.value)} />
                <select name="currency" onChange={e=>setCurrencyForSimpleSend(e.target.value)}>
                  <option value="">--Please choose your currency--</option>
                  <option value="flex">FLEX</option>
                  <option value="bch">BCH</option>
                </select>
                <button onClick={onSimpleSending}>send</button>
              </form>
            </li>
            {/* <li>
              <form>
                <label>
                  Stake For Other Address:
                </label>
                <input type="text" placeholder="address" size="45" onChange={e=>setAddressDepositFor(e.target.value)} />
                <input type="text" placeholder="amount (FLEX)" onChange={e=>setAmountDepositFor(e.target.value)} />
                <button onClick={onDepositFor}>{textDepositFor}</button>
              </form>
            </li>
            <li>
              <form>
                <label>
                  Stake For 4 addresses in batch:
                </label>
                <ul>
                  <li>
                    <input type="text" placeholder="address" size="45" onChange={e=>onAddress4DepositFor(e.target.value, setAddress1DepositFor, setLocked1)} />
                    <input type="text" placeholder="amount (FLEX)" onChange={e=>onAmountForDeposit(e.target.value, setAmount1DepositFor)} />
                    {locked1 ? `staked ${locked1[0]} FLEX, end at: ${new Date(locked1[1] * 1000).toLocaleString()} Local Time` : ""}
                  </li>
                  <li>
                    <input type="text" placeholder="address" size="45" onChange={e=>onAddress4DepositFor(e.target.value, setAddress2DepositFor, setLocked2)} />
                    <input type="text" placeholder="amount (FLEX)" onChange={e=>onAmountForDeposit(e.target.value, setAmount2DepositFor)} />
                    {locked2 ? `staked ${locked2[0]} FLEX, end at: ${new Date(locked2[1] * 1000).toLocaleString()} Local Time` : ""}
                  </li>
                  <li>
                    <input type="text" placeholder="address" size="45" onChange={e=>onAddress4DepositFor(e.target.value, setAddress3DepositFor, setLocked3)} />
                    <input type="text" placeholder="amount (FLEX)" onChange={e=>onAmountForDeposit(e.target.value, setAmount3DepositFor)} />
                    {locked3 ? `staked ${locked3[0]} FLEX, end at: ${new Date(locked3[1] * 1000).toLocaleString()} Local Time` : ""}
                  </li>
                  <li>
                    <input type="text" placeholder="address" size="45" onChange={e=>onAddress4DepositFor(e.target.value, setAddress4DepositFor, setLocked4)} />
                    <input type="text" placeholder="amount (FLEX)" onChange={e=>onAmountForDeposit(e.target.value, setAmount4DepositFor)} />
                    {locked4 ? `staked ${locked4[0]} FLEX, end at: ${new Date(locked4[1] * 1000).toLocaleString()} Local Time` : ""}
                  </li>
                  <button onClick={onDepositFor4}>{textDepositFor}</button>
                </ul>
              </form>
            </li>
            <li>
              <form>
                <label>
                  Stake For Other Addresses in batch (.csv only):
                </label>
                <input type="file" id="file" accept='.csv' onChange={e => onUploadStakeBatchFile(e)} />
                <button onClick={onDepositForInBatch}>{textDepositFor}</button>
              </form>
            </li> */}
          </ul>
        </div>
      }
      
    </div>
  );
}
