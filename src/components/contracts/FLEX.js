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

  const [address1For4BulkSending, setAddress1For4BulkSending] = useState();
  const [address2For4BulkSending, setAddress2For4BulkSending] = useState();
  const [address3For4BulkSending, setAddress3For4BulkSending] = useState();
  const [address4For4BulkSending, setAddress4For4BulkSending] = useState();
  const [amount1For4BulkSending, setAmount1For4BulkSending] = useState();
  const [amount2For4BulkSending, setAmount2For4BulkSending] = useState();
  const [amount3For4BulkSending, setAmount3For4BulkSending] = useState();
  const [amount4For4BulkSending, setAmount4For4BulkSending] = useState();
  const [currencyFor4BulkSending, setCurrencyFor4BulkSending] = useState();

  const [addressesForBulkSending, setAddressesForBulkSending] = useState();
  const [amountsForBulkSending, setAmountsForBulkSending] = useState();
  const [currencyForBulkSending, setCurrencyForBulkSending] = useState();



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
      if (addressForSimpleSend && amountForSimpleSend && currencyForSimpleSend) {
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
      if (typeof(err) === 'string') {
        setTxStatusText(err);
      } else {
        if (err.data && err.data.message) {
          setTxStatusText(err.data.message);
        }
      }
      errorHandle('onSimpleSending', err);
    }
  }

  const onAmountFor4BulkSending = async (value, setAmountFor4BulkSending) => {
    try {
      setAmountFor4BulkSending(utils.parseEther(value));
    } catch (err) {
      errorHandle('onAmountFor4BulkSending', err);
    }
  }

  const on4BulkSending = async (e) => {
    try {
      e.preventDefault();
      if (address1For4BulkSending && address2For4BulkSending && address3For4BulkSending && address4For4BulkSending && amount1For4BulkSending && amount2For4BulkSending && amount3For4BulkSending && amount4For4BulkSending && currencyFor4BulkSending) {
        // console.log(address1For4BulkSending);
        // console.log(address2For4BulkSending);
        // console.log(address3For4BulkSending);
        // console.log(address4For4BulkSending);
        // console.log(amount1For4BulkSending.toString());
        // console.log(amount2For4BulkSending.toString());
        // console.log(amount3For4BulkSending.toString());
        // console.log(amount4For4BulkSending.toString());
        // console.log(currencyFor4BulkSending);
      }
    } catch (err) {
      if (typeof(err) === 'string') {
        setTxStatusText(err);
      } else {
        if (err.data && err.data.message) {
          setTxStatusText(err.data.message);
        }
      }
      errorHandle('on4BulkSending', err);
    }
  }

  const onUploadStakeBatchFile = (e) => {
    try {
      const reader = new FileReader();
      reader.onload = onReaderLoad;
      reader.readAsBinaryString(e.target.files[0]);
    } catch (err) {
      errorHandle('onUploadStakeBatchFile', err);
    }
  }

  const onReaderLoad = (e) => {
    try {
      const fileStr = e.target.result;
      const inputArray = fileStr.split('\r\n');
      const addressArray = [];
      const amountArray = [];
      for (let ele of inputArray) {
        const stake = ele.split(',');
        if (stake && stake[0] && stake[0].startsWith('0x')) {
          addressArray.push(stake[0]);
          amountArray.push(utils.parseEther(stake[1]));
        }
      }
      for (let i =0;i<addressArray.length;i++){
        console.log(addressArray[i]);
        console.log(amountArray[i].toString());
      }
      setAddressesForBulkSending(addressArray);
      setAmountsForBulkSending(amountArray);
    } catch (err) {
      errorHandle('onReaderLoad', err);
    }
  }

  const onBulkSending = async (e) => {
    try {
      e.preventDefault();
      if (addressesForBulkSending && amountsForBulkSending && currencyForBulkSending) {
        // console.log(addressesForBulkSending);
        // console.log(amountsForBulkSending);
        // console.log(currencyForBulkSending);
      }
    } catch (err) {
      errorHandle('onBulkSending', err);
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
                <input type="text" placeholder="amount (ETH Unit)" onChange={e=>setAmountForSimpleSend(e.target.value)} />
                <select name="currency" onChange={e=>setCurrencyForSimpleSend(e.target.value)}>
                  <option value="">--Please choose your currency--</option>
                  <option value="flex">FLEX</option>
                  <option value="bch">BCH</option>
                </select>
                <button onClick={onSimpleSending}>send</button>
              </form>
            </li>
            <li>
              <form>
                <label>
                  Bulk Sending For 4 addresses:
                </label>
                <ul>
                  <li>
                    <input type="text" placeholder="address" size="45" onChange={e=>setAddress1For4BulkSending(e.target.value)} />
                    <input type="text" placeholder="amount (ETH Unit)" onChange={e=>onAmountFor4BulkSending(e.target.value, setAmount1For4BulkSending)} />
                  </li>
                  <li>
                    <input type="text" placeholder="address" size="45" onChange={e=>setAddress2For4BulkSending(e.target.value)} />
                    <input type="text" placeholder="amount (ETH Unit)" onChange={e=>onAmountFor4BulkSending(e.target.value, setAmount2For4BulkSending)} />
                  </li>
                  <li>
                    <input type="text" placeholder="address" size="45" onChange={e=>setAddress3For4BulkSending(e.target.value)} />
                    <input type="text" placeholder="amount (ETH Unit)" onChange={e=>onAmountFor4BulkSending(e.target.value, setAmount3For4BulkSending)} />
                  </li>
                  <li>
                    <input type="text" placeholder="address" size="45" onChange={e=>setAddress4For4BulkSending(e.target.value)} />
                    <input type="text" placeholder="amount (ETH Unit)" onChange={e=>onAmountFor4BulkSending(e.target.value, setAmount4For4BulkSending)} />
                  </li>
                  <select name="currency" onChange={e=>setCurrencyFor4BulkSending(e.target.value)}>
                    <option value="">--Please choose your currency--</option>
                    <option value="flex">FLEX</option>
                    <option value="bch">BCH</option>
                  </select>
                  <button onClick={on4BulkSending}>bulk send for 4 addr</button>
                </ul>
              </form>
            </li>
            <li>
              <form>
                <label>
                  Bulk Sending From File (.csv only):
                </label>
                <input type="file" id="file" accept='.csv' onChange={e => onUploadStakeBatchFile(e)} />
                <select name="currency" onChange={e=>setCurrencyForBulkSending(e.target.value)}>
                    <option value="">--Please choose your currency--</option>
                    <option value="flex">FLEX</option>
                    <option value="bch">BCH</option>
                  </select>
                <button onClick={onBulkSending}>bulk send</button>
              </form>
            </li>
          </ul>
        </div>
      }
      
    </div>
  );
}
