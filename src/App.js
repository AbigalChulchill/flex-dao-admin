import { getConn, getDailyPayout, getVeFlex, getDistributor, getFlex } from './conn';
import { Payout } from './components/Payout';
import { VeFLEX } from './components/VeFLEX';
import { Distributor } from './components/Distributor';
import { FLEX } from "./components/FLEX";
import { useEffect, useState } from "react";
import { errorHandle } from "./utils";

function App() {

  const [dailyPayout, setDailyPayout] = useState();
  const [veFlex, setVeFlex] = useState();
  const [distributor, setDistributor] = useState();
  const [flex, setFlex] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const _conn = await getConn();
        if (_conn) {
          const _dailyPayout = getDailyPayout(_conn);
          if (_dailyPayout) setDailyPayout(_dailyPayout);
          const _veFlex = getVeFlex(_conn);
          if (_veFlex) setVeFlex(_veFlex);
          const _distributor = getDistributor(_conn);
          if (_distributor) setDistributor(_distributor);
          const _flex = getFlex(_conn);
          if (_flex) setFlex(_flex);
        }
      } catch (err) {
        errorHandle('init connection with blockchain', err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container">
      <Payout payout={dailyPayout}></Payout>
      <VeFLEX veflex={veFlex}></VeFLEX>
      <Distributor distributor={distributor}></Distributor>
      <FLEX flex={flex}></FLEX>
    </div>
  );
}

export default App;
