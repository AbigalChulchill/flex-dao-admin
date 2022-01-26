import { useEffect, useState } from "react";
import { BigNumber, utils } from 'ethers';
import { errorHandle } from "../../utils";

async function getBalanceOf(flex, value) {
  try {
    return await flex.balanceOf(value);
  } catch (err) {
    errorHandle('getBalanceOf', err);
  }
}

async function getBchBalanceOf(conn, bchAddressBalanceOf) {
  try {
    return await conn.getBalance(bchAddressBalanceOf);
  } catch (err) {
    errorHandle('getBchBalanceOf', err);
  }
}

async function bulkSending(transferToken, flex, addressArray, amountArray, currency, setTxStatus, setTxStatusText, approved, setApproved) {
  try {
    let gasLimitBn;
    if (currency === 'flex') {
      if (approved) {
        gasLimitBn = await transferToken.estimateGas.sendToken(addressArray, amountArray, flex.address); 
        const tx = await transferToken.sendToken(addressArray, amountArray, flex.address, {
          gasLimit: gasLimitBn,
          gasPrice: utils.parseUnits('1.05', 'gwei')
        });
        setTxStatus(true);
        setTxStatusText(`pending - ${tx.hash}`);
        tx.wait(2).then((receipt) => {
          setTxStatus(false);
          setTxStatusText(`confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
        })
      } else {
        // approve 
        const approveAmountBn = utils.parseEther('1000000000.0')
        console.log(`approve ${approveAmountBn.toString()} FLEX-WEI to transferToken contract...`)
        gasLimitBn = await flex.estimateGas.approve(transferToken.address, approveAmountBn)
        const tx = await flex.approve(transferToken.address, approveAmountBn, {
          gasLimit: gasLimitBn,
          gasPrice: utils.parseUnits('1.05', 'gwei')
        })
        setTxStatus(true);
        setTxStatusText(`pending - ${tx.hash}`);
        tx.wait(2).then((receipt) => {
          setTxStatus(false);
          setTxStatusText(`confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
          setApproved(true);
        })
      }
    } else if (currency === 'bch') {      
      let totalAmount = BigNumber.from(0);
      for (let amount of amountArray) {
        totalAmount = totalAmount.add(amount);
      }
      gasLimitBn = await transferToken.estimateGas.sendNativeToken(addressArray, amountArray, {
        value: totalAmount
      }); 
      const tx = await transferToken.sendNativeToken(addressArray, amountArray, {
        gasLimit: gasLimitBn,
        gasPrice: utils.parseUnits('1.05', 'gwei'),
        value: totalAmount
      });
      setTxStatus(true);
      setTxStatusText(`pending - ${tx.hash}`);
      tx.wait(2).then((receipt) => {
        setTxStatus(false);
        setTxStatusText(`confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
      })
    }
  } catch (err) {
    if (typeof(err) === 'string') {
      setTxStatusText(err);
    } else {
      if (err.data && err.data.message) {
        setTxStatusText(err.data.message);
      }
    }
    errorHandle('bulkSending', err);
  }
}

export function FLEX({ flex, enableTx, conn, transferToken, initialData}) {

  const [querying, setQuerying] = useState();

  const [name, setName] = useState();
  const [addr, setAddr] = useState();
  const [admin, setAdmin] = useState();
  const [totalSupply, setTotalSupply] = useState();
  
  const [transferTokenContractAddress, setTransferTokenContractAddress] = useState();
  const [transferTokenContractAdmin, setTransferTokenContractAdmin] = useState();

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

  const [bchAddressBalanceOf, setBchAddressBalanceOf] = useState();
  const [bchBalanceOf, setBchBalanceOf] = useState();

  const [approved, setApproved] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        if (flex && initialData && transferToken) {
          
          setName('FLEX');
          setAddr(flex.address);
          setTransferTokenContractAddress(transferToken.address);

          const {flexAdmin,flexTotalSupply, transferTokenAdmin} = initialData;
          if (flexAdmin) setAdmin(flexAdmin);
          if (flexTotalSupply) setTotalSupply(utils.formatEther(flexTotalSupply));
          if (transferTokenAdmin) setTransferTokenContractAdmin(transferTokenAdmin);

          if (enableTx) {
            const sender = await conn.getSigner().getAddress();
            setWalletAddress(sender);
  
            const allowanceBn =  await flex.allowance(sender, transferToken.address);
            if (allowanceBn.gt(0)) {
              setApproved(true);
            } else {
              setApproved(false);
            }
          }
        }
      } catch (err) {
        errorHandle('flex initial', err);
      }
    }
    fetchData();
    return () => {
      setName();
      setAddr();
      setAdmin();
      setTotalSupply();
    }
  }, [flex, enableTx, conn, transferToken, initialData]);

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

  const onBchBalanceOf = async (e) => {
    e.preventDefault();
    setBchBalanceOf(undefined);
    if (querying) return;
    setQuerying(true);
    if (conn && bchAddressBalanceOf) {
      const _balanceOf = await getBchBalanceOf(conn, bchAddressBalanceOf);
      if (_balanceOf) setBchBalanceOf(utils.formatEther(_balanceOf));
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
    e.preventDefault();
    if (address1For4BulkSending && address2For4BulkSending && address3For4BulkSending && address4For4BulkSending && amount1For4BulkSending && amount2For4BulkSending && amount3For4BulkSending && amount4For4BulkSending && currencyFor4BulkSending) {
      const addressArray = [address1For4BulkSending, address2For4BulkSending, address3For4BulkSending, address4For4BulkSending];
      const amountArray = [amount1For4BulkSending, amount2For4BulkSending, amount3For4BulkSending, amount4For4BulkSending];
      await bulkSending(transferToken, flex, addressArray, amountArray, currencyFor4BulkSending, setTxStatus, setTxStatusText, approved, setApproved)
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
    e.preventDefault();
    if (addressesForBulkSending && amountsForBulkSending && currencyForBulkSending) {
      await bulkSending(transferToken, flex, addressesForBulkSending, amountsForBulkSending, currencyForBulkSending, setTxStatus, setTxStatusText, approved, setApproved)
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
          <li>
            <form>
              <label>
                BCH Balance Of Account:
              </label>
              <input type="text" placeholder="address" size="45" onChange={ e => setBchAddressBalanceOf(e.target.value)} />
              <button onClick={onBchBalanceOf}>Read</button>
              <span>{bchBalanceOf} {bchBalanceOf ? 'BCH' : ''}</span>
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
            <p>Transfer Token Contract info:</p>
            <ul>
              <li>address: {transferTokenContractAddress}</li>
              <li>admin: {transferTokenContractAdmin}</li>
            </ul>
            <p></p>
            <li>
              <form>
                <label>
                  Simple Sending:
                </label>
                <select name="currency" onChange={e=>setCurrencyForSimpleSend(e.target.value)}>
                  <option value="">--Please choose your currency--</option>
                  <option value="flex">FLEX</option>
                  <option value="bch">BCH</option>
                </select>
                <input type="text" placeholder="address" size="45" onChange={e=>setAddressForSimpleSend(e.target.value)} />
                <input type="text" placeholder="amount (ETH Unit)" onChange={e=>setAmountForSimpleSend(e.target.value)} />
                <button onClick={onSimpleSending}>Simple Send</button>
              </form>
            </li>
            <li>
              <form>
                <label>
                  Bulk Sending For 4 addresses:
                </label>
                <ul>
                  <select name="currency" onChange={e=>setCurrencyFor4BulkSending(e.target.value)}>
                    <option value="">--Please choose your currency--</option>
                    <option value="flex">FLEX</option>
                    <option value="bch">BCH</option>
                  </select>
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
                  <button onClick={on4BulkSending}>{!approved && currencyFor4BulkSending === 'flex' ? 'Approve':'Bulk Send for 4 Addresses'}</button>
                </ul>
              </form>
            </li>
            <li>
              <form>
                <label>
                  Bulk Sending From File (.csv only):
                </label>
                <select name="currency" onChange={e=>setCurrencyForBulkSending(e.target.value)}>
                    <option value="">--Please choose your currency--</option>
                    <option value="flex">FLEX</option>
                    <option value="bch">BCH</option>
                  </select>
                <input type="file" id="file" accept='.csv' onChange={e => onUploadStakeBatchFile(e)} />
                <button onClick={onBulkSending}>{!approved && currencyForBulkSending === 'flex' ? 'Approve':'Bulk Send'}</button>
              </form>
            </li>
          </ul>
        </div>
      }
      
    </div>
  );
}
