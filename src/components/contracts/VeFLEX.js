import { useEffect, useState } from "react";
import { utils } from "ethers";
import { errorHandle, tsToLocalStr } from "../../utils";

async function getLocked(veflex, value) {
  try {
    return await veflex.locked(value);
  } catch (err) {
    errorHandle('getLocked', err);
  }
}


async function getBalanceOf(veflex, value) {
  try {
    return await veflex.balanceOf(value);
  } catch (err) {
    errorHandle('getBalanceOf', err);
  }
}

async function getTotalSupplyAt(veflex, value) {
  try {
    return await veflex.totalSupplyAt(Number(value));
  } catch (err) {
    errorHandle('getTotalSupplyAt', err);
  }
}

async function getBalanceOfAt(veflex, address, height) {
  try {
    return await veflex.balanceOfAt(address, Number(height));
  } catch (err) {
    errorHandle('getBalanceOfAt', err);
  }
}

async function createLock(veflex, flex, textCreateLock, amount, timestamp, setTxStatus, setTxStatusText, setTextCreateLock) {
  try {

    let gasLimitBn;
    
    if (textCreateLock === 'Approve') {
      // approve 
      const approveAmountBn = utils.parseEther('1000000000.0')
      console.log(`approve ${approveAmountBn.toString()} FLEX-WEI to veFlex contract...`)
      gasLimitBn = await flex.estimateGas.approve(veflex.address, approveAmountBn)
      const tx = await flex.approve(veflex.address, approveAmountBn, {
        gasLimit: gasLimitBn,
        gasPrice: utils.parseUnits('1.05', 'gwei')
      })
      setTxStatus(true);
      setTxStatusText(`pending - ${tx.hash}`);
      tx.wait(2).then((receipt) => {
        setTxStatus(false);
        setTxStatusText(`confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
        setTextCreateLock('Create Lock');
      })
    } else if (textCreateLock ==='Create Lock') {
      const amountBn = utils.parseEther(amount);
      gasLimitBn = await veflex.estimateGas.create_lock(amountBn, Number(timestamp)); 
      const tx = await veflex.create_lock(amountBn, Number(timestamp), {
        gasLimit: gasLimitBn,
        gasPrice: utils.parseUnits('1.05', 'gwei')
      });
      setTxStatus(true);
      setTxStatusText(`pending - ${tx.hash}`);
      tx.wait(2).then((receipt) => {
        setTxStatus(false);
        setTxStatusText(`confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
      })
    }
  } catch (err) {
    setTxStatus(true);
    if (typeof(err) === 'string') {
      setTxStatusText(err);
    } else {
      if (err.data && err.data.message) {
        setTxStatusText(err.data.message);
      }
    }
    errorHandle('createLock', err);
  }
}

async function depositForInBatch(increaseStake, flex, addressForDepositForInBatch, amountForDepositForInBatch, setTxStatus, setTxStatusText, textDepositFor, setTextDepositFor) {
  try {
    let gasLimitBn;
    if (textDepositFor === 'Approve') {
      const approveAmountBn = utils.parseEther('1000000000.0')
      console.log(`approve ${approveAmountBn.toString()} FLEX-WEI to increaseStake contract...`)
      gasLimitBn = await flex.estimateGas.approve(increaseStake.address, approveAmountBn)
      const tx = await flex.approve(increaseStake.address, approveAmountBn, {
        gasLimit: gasLimitBn,
        gasPrice: utils.parseUnits('1.05', 'gwei')
      })
      setTxStatus(true);
      setTxStatusText(`pending - ${tx.hash}`);
      tx.wait(2).then((receipt) => {
        setTxStatus(false);
        setTxStatusText(`confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
        setTextDepositFor('Deposit For');
      })
    } else if (textDepositFor === 'Deposit For') {
      gasLimitBn = await increaseStake.estimateGas.depositFor(addressForDepositForInBatch, amountForDepositForInBatch);
      const tx = await increaseStake.depositFor(addressForDepositForInBatch, amountForDepositForInBatch, {
        gasLimit: gasLimitBn.mul(100).div(99),
        gasPrice: utils.parseUnits('1.05', 'gwei')
      });
      setTxStatus(true);
      setTxStatusText(`pending - ${tx.hash}`);
      tx.wait(2).then((receipt) => {
        setTxStatus(false);
        setTxStatusText(`confirmed - ${receipt.transactionHash} - ${receipt.confirmations} blocks`);
      }).catch((err) => {
        setTxStatus(true);
        if (typeof(err) === 'string') {
          setTxStatusText(err);
        } else {
          if (err.data && err.data.message) {
            setTxStatusText(err.data.message);
          }
        }
        errorHandle('depositForInBatch', err);
      })
    }
  } catch (err) {
    setTxStatus(true);
    if (typeof(err) === 'string') {
      setTxStatusText(err);
    } else {
      if (err.data && err.data.message) {
        setTxStatusText(err.data.message);
      }
    }
    errorHandle('depositForInBatch', err);
  }
}

export function VeFLEX({ veflex, flex, conn, increaseStake, initialData }) {

  const [querying, setQuerying] = useState();

  const [walletAddress, setWalletAddress] = useState();
  
  const [name, setName] = useState();
  const [addr, setAddr] = useState();
  const [admin, setAdmin] = useState();
  
  const [token, setToken] = useState();
  const [supply, setSupply] = useState();
  const [totalSupply, setTotalSupply] = useState();
  
  const [addressLocked, setAddressLocked] = useState();
  const [locked, setLocked] = useState();
  
  const [addressBalanceOf, setAddressBalanceOf] = useState();
  const [balanceOf, setBalanceOf] = useState();
  
  const [heightTotalSupplyAt, setHeightTotalSupplyAt] = useState();
  const [totalSupplyAt, setTotalSupplyAt] = useState();
  
  const [addressBalanceOfAt, setAddressBalanceOfAt] = useState();
  const [heightBalanceOfAt, setHeightBalanceOfAt] = useState();
  const [balanceOfAt, setBalanceOfAt] = useState();
  
  const [amountCreateLock, setAmountCreateLock] = useState();
  const [timestampCreateLock, setTimestampCreateLock] = useState();
  const [textCreateLock, setTextCreateLock] = useState();

  const [textDepositFor, setTextDepositFor] = useState();
  
  const [addressDepositFor, setAddressDepositFor] = useState();
  const [amountDepositFor, setAmountDepositFor] = useState();
  
  const [txStatus, setTxStatus] = useState();
  const [txStatusText, setTxStatusText] = useState();

  const [address1DepositFor, setAddress1DepositFor] = useState();
  const [address2DepositFor, setAddress2DepositFor] = useState();
  const [address3DepositFor, setAddress3DepositFor] = useState();
  const [address4DepositFor, setAddress4DepositFor] = useState();

  const [locked1, setLocked1] = useState();
  const [locked2, setLocked2] = useState();
  const [locked3, setLocked3] = useState();
  const [locked4, setLocked4] = useState();

  const [amount1DepositFor, setAmount1DepositFor] = useState();
  const [amount2DepositFor, setAmount2DepositFor] = useState();
  const [amount3DepositFor, setAmount3DepositFor] = useState();
  const [amount4DepositFor, setAmount4DepositFor] = useState();

  const [addressForDepositForInBatch, setAddressForDepositForInBatch] = useState();
  const [amountForDepositForInBatch, setAmountForDepositForInBatch] = useState();

  const [depositEvents, setDepositEvents] = useState([]);
  const [depositEventsLoading, setDepositEventsLoading] = useState(false);

  const [withdrawEvents, setWithdrawEvents] = useState([]);
  const [withdrawEventsLoading, setWithdrawEventsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        if (veflex && flex && initialData) {

          console.log(`increaseStake works for veFlex: ${await increaseStake.vestingToken()}`);
          console.log(`increaseStake works for flex token: ${await increaseStake.token()}`);

          const sender = await conn.getSigner().getAddress();
          setWalletAddress(sender);
          const allowanceBn =  await flex.allowance(sender, veflex.address);
          if (allowanceBn.gt(0)) {
            setTextCreateLock('Create Lock')
          } else {
            setTextCreateLock('Approve');
          }

          const allowanceForIncreaseStakeBn =  await flex.allowance(sender, increaseStake.address);
          if (allowanceForIncreaseStakeBn.gt(0)) {
            setTextDepositFor('Deposit For');
          } else {
            setTextDepositFor('Approve');
          }
          
          setName('veFlex');
          setAddr(veflex.address);
  
          const {veFlexAdmin, veFlexToken, veFlexSupply, veFlexTotalSupply} = initialData;
          if (veFlexAdmin) setAdmin(veFlexAdmin);
          if (veFlexToken) setToken(veFlexToken);
          if (veFlexSupply) setSupply(utils.formatEther(veFlexSupply));
          if (veFlexTotalSupply) setTotalSupply(utils.formatEther(veFlexTotalSupply));
  
        }
      } catch (err) {
        errorHandle('veFlex init', err);
      }
    }
    fetchData();
    return () => {
      setWalletAddress();
      setTextCreateLock();
      setTextDepositFor();
      setName();
      setAddr();
      setAdmin();
      setToken();
      setSupply();
      setTotalSupply();
    }
  }, [veflex, flex, conn, increaseStake, initialData]);

  const onLocked = async (e) => {
    e.preventDefault();
    setLocked(undefined);
    if (querying) return;
    setQuerying(true);
    if (veflex && addressLocked) {
      const _locked = await getLocked(veflex, addressLocked);
      if (_locked) setLocked([utils.formatEther(_locked.amount), _locked.end.toString()]);
    }
    setQuerying(false);
  }

  const onBalanceOf = async (e) => {
    e.preventDefault();
    setBalanceOf(undefined);
    if (querying) return;
    setQuerying(true);
    if (veflex && addressBalanceOf) {
      const _balanceOf = await getBalanceOf(veflex, addressBalanceOf);
      if (_balanceOf) setBalanceOf(utils.formatEther(_balanceOf));
    }
    setQuerying(false);
  }

  const onTotalSupplyAt = async (e) => {
    e.preventDefault()
    setTotalSupplyAt(undefined);
    if (querying) return;
    setQuerying(true);
    if (veflex && heightTotalSupplyAt) {
      const _totalSupplyAt = await getTotalSupplyAt(veflex, heightTotalSupplyAt);
      if (_totalSupplyAt) setTotalSupplyAt(utils.formatEther(_totalSupplyAt));
    }
    setQuerying(false);
  }

  const onBalanceOfAt = async (e) => {
    e.preventDefault();
    setBalanceOfAt(undefined);
    if (querying) return;
    setQuerying(true);
    if (veflex && addressBalanceOfAt && heightBalanceOfAt) {
      const _balanceOfAt = await getBalanceOfAt(veflex, addressBalanceOfAt, heightBalanceOfAt);
      if (_balanceOfAt) setBalanceOfAt(utils.formatEther(_balanceOfAt));
    }
    setQuerying(false);
  }

  const onCreateLock = async (e) => {
    e.preventDefault()
    if (veflex && flex && amountCreateLock && timestampCreateLock) {
      await createLock(veflex, flex, textCreateLock, amountCreateLock, timestampCreateLock, setTxStatus, setTxStatusText, setTextCreateLock);
    }
  }

  const onDepositFor = async (e) => {
    e.preventDefault()
    try {
      if (addressDepositFor && amountDepositFor) {
        const amountBn = utils.parseEther(amountDepositFor);
        await depositForInBatch(increaseStake, flex, [addressDepositFor], [amountBn], setTxStatus, setTxStatusText, textDepositFor, setTextDepositFor)
      }
    } catch (err) {
      errorHandle('onDepositFor', err);
    }
  }

  const onAddress4DepositFor = async (value, setAddress, setLocked) => {  
    try {
      if (value) {
        setAddress(value);
        const locked = await getLocked(veflex, value);
        setLocked([utils.formatEther(locked.amount), locked.end.toString()]);
      }
    } catch (err) {
      errorHandle('onAddress4DepositFor', err);
    }
  }

  const onDepositFor4 = async (e) => {
    e.preventDefault();
    if (address1DepositFor && address2DepositFor && address3DepositFor && address4DepositFor && amount1DepositFor && amount2DepositFor && amount3DepositFor && amount4DepositFor) {
      const addressArray = [address1DepositFor, address2DepositFor, address3DepositFor, address4DepositFor];
      const amountArray = [amount1DepositFor, amount2DepositFor, amount3DepositFor, amount4DepositFor]
      await depositForInBatch(increaseStake, flex, addressArray, amountArray, setTxStatus, setTxStatusText, textDepositFor, setTextDepositFor);
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
      setAddressForDepositForInBatch(addressArray);
      setAmountForDepositForInBatch(amountArray);
    } catch (err) {
      errorHandle('onReaderLoad', err);
    }
  }

  const onDepositForInBatch = async (e) => {
    e.preventDefault();
    if (addressForDepositForInBatch && amountForDepositForInBatch) {
      await depositForInBatch(increaseStake, flex, addressForDepositForInBatch, amountForDepositForInBatch, setTxStatus, setTxStatusText, textDepositFor, setTextDepositFor);
    }
  }

  const onQueryDepositHistory = async () => {
    setDepositEventsLoading(true);
    const _depositEventsFilter = veflex.filters.Deposit(null);
    const _depositEvents = await veflex.queryFilter(_depositEventsFilter);
    if (_depositEvents) {
      setDepositEvents(_depositEvents);
      setDepositEventsLoading(false);
    }
    
    const uniAddresses = new Map();
    for (let event of _depositEvents) {
      if (!uniAddresses.has(event.args.provider)) {
        uniAddresses.set(event.args.provider, undefined)
      }
    }
    console.log(`unique address: ${uniAddresses.size}`)

    let count = 0
    for (let addr of uniAddresses.keys()) {
      const _locked = await veflex.locked(addr);
      if (!_locked.amount.eq(0)) {
        console.log(`${addr}  ${utils.formatEther(_locked.amount)}  ${_locked.end.toString()}`);
        count++;
      }
    }
    console.log(`total: ${count}`);
  }

  const onQueryWithdrawHistory = async () => {
    setWithdrawEventsLoading(true);
    const _withdrawEventsFilter = veflex.filters.Withdraw(null);
    const _withdrawEvents = await veflex.queryFilter(_withdrawEventsFilter);
    if (_withdrawEvents) {
      setWithdrawEvents(_withdrawEvents);
      setWithdrawEventsLoading(false);
    }
  }

  const onAmountForDeposit = async (value, setAmountFunc) => {
    try {
      setAmountFunc(utils.parseEther(value))
    } catch (err) {
      errorHandle('onAmountForDeposit', err);
    }
  }

  const depositItems = depositEvents.map( (event, index) => {
    return (
      <li key = {index}>
        {event.blockNumber}: {event.args.provider}, {utils.formatEther(event.args.value)}, {tsToLocalStr(event.args.locktime.toString())}, {event.args.type.toString()}, {tsToLocalStr(event.args.ts.toString())}
      </li>
    )
  })

  const withdrawItems = withdrawEvents.map( (event, index) => {
    return (
      <li key = {index}>
        {event.blockNumber}: {event.args.provider}, {utils.formatEther(event.args.value)}, {tsToLocalStr(event.args.ts.toString())}
      </li>
    )
  })

  return (
    <div className="box">
      <div className="info">
        <div className="bulletin">
          == Contract Name: {name} ==
        </div>
        <ul>
          <li>Contract Addr: {addr}</li>
          <li>Contract Admin: {admin}</li>
          <li>FLEX Addr: {token}</li>
          <li>Supply: {supply} FLEX</li>
          <li>Total Supply: {totalSupply} veFLEX</li>
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
                Stake Detail For Address:
              </label>
              <input type="text" placeholder="address" size="45" onChange={e=>setAddressLocked(e.target.value)} />
              <button onClick={onLocked}>Read</button>
              {locked ? `staked ${locked[0]} FLEX, end at: ${new Date(locked[1] * 1000).toLocaleString()} Local Time` : ""}
            </form>
          </li>
          <li>
            <form>
              <label>
                Account Latest Balance:
              </label>
              <input type="text" placeholder="address" size="45" onChange={e=>setAddressBalanceOf(e.target.value)} />
              <button onClick={onBalanceOf}>Read</button>
              <span>{balanceOf} {balanceOf?"veFLEX":""}</span>
            </form>
          </li>
          <li>
            <form>
              <label>
                History Total Supply At Block Height:
              </label>
              <input type="text" placeholder="block height (uint)" onChange={e=>setHeightTotalSupplyAt(e.target.value)} />
              <button onClick={onTotalSupplyAt}>Read</button>
              <span>{totalSupplyAt} {totalSupplyAt?"veFLEX":""}</span>
            </form>
          </li>
          <li>
            <form>
              <label>
                History Account Balance At Block Height:
              </label>
              <input type="text" placeholder="address" size="45" onChange={e=>setAddressBalanceOfAt(e.target.value)} />
              <input type="text" placeholder="block height (uint)" onChange={e=>setHeightBalanceOfAt(e.target.value)} />
              <button onClick={onBalanceOfAt}>Read</button>
              <span>{balanceOfAt} {balanceOfAt?"veFLEX":""}</span>
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
          <li>
            <form>
              <label>
                Inital Stake:
              </label>
              <input type="text" placeholder="amount (FLEX)" onChange={e=>setAmountCreateLock(e.target.value)} />
              <input type="text" placeholder="expiry timestamp (s)" onChange={e=>setTimestampCreateLock(e.target.value)} />
              <button onClick={onCreateLock}>{textCreateLock}</button>
            </form>
          </li>
          <li>
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
          </li>
        </ul>
      </div>
      <div className="events">
        <div className="eventName">
          == Deposit History == 
        </div>
        <div className="eventList">
          <div>
            <button onClick={onQueryDepositHistory}>Query</button>
          </div>
          <ul>
            {depositEventsLoading ? "Loading" : depositItems}
          </ul>
          <p>total: {depositEvents.length}</p>
        </div>
        <div className="eventName">
          == Withdral History ==
        </div>
        <div className="eventList">
          <div>
            <button onClick={onQueryWithdrawHistory}>Query</button>
          </div>
          <ul>
            {withdrawEventsLoading ? "Loading" : withdrawItems}
          </ul>
          <p>total: {withdrawEvents.length}</p>
        </div>
      </div>
    </div>
  );
}
