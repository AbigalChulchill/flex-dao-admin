import { getConn, getDailyPayout, getVeFlex } from './conn';
import { Payout } from './components/Payout';
import { VeFLEX} from './components/VeFLEX';
import { useEffect, useState } from "react";
import { errorHandle } from "./utils";

function App() {

  const [dailyPayout, setDailyPayout] = useState();
  const [veFlex, setVeFlex] = useState();

  useEffect( () => {
    async function fetchData() {
      try {
        const _conn = await getConn();
        if(_conn) {
          const _dailyPayout = getDailyPayout(_conn);
          if (_dailyPayout) setDailyPayout(_dailyPayout);
          const _veFlex = getVeFlex(_conn);
          if (_veFlex) setVeFlex(_veFlex);
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
    </div>
  );
}

export default App;
