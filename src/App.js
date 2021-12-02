import { getConn, getDailyPayout } from './conn';
import { Payout } from './components/Payout';
import { useEffect, useState } from "react";
import { errorHandle } from "./utils";

function App() {

  const [dailyPayout, setDailyPayout] = useState();
  
  useEffect( () => {
    async function fetchData() {
      try {
        const _conn = await getConn();
        const _dailyPayout = getDailyPayout(_conn);
        setDailyPayout(_dailyPayout);
      } catch (err) {
        errorHandle('getConn', err);
      } 
    }
    fetchData();
  }, []);

  return (
    <div className="container">
      <Payout payout={dailyPayout}></Payout>
    </div>
  );
}

export default App;
