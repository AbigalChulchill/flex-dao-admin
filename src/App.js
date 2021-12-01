import { getConn } from './conn'
import { useEffect, useState } from "react";

function App() {

  const [conn, setConn] = useState();
  
  useEffect( () => {
    async function fetchData() {
      try {
        const _conn = await getConn();
        setConn(_conn);
      } catch (err) {
        if (err.data && err.data.message) {
          window.alert(err.data.message);
        } else {
          window.alert(err);
        }
      } 
    }
    fetchData();
  }, [conn]);

  return (
    <div className="container">
      <h1>Hello FLEX-DAO</h1>
    </div>
  );
}

export default App;
