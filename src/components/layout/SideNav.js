import { Link } from 'react-router-dom';

export const SideNav = () => {
  return (
    <div className="sidebar">
      <div>
        <Link to="/">ADMIN PAGE</Link>
      </div>
      <div className="menu">
        <div className="item">
          <Link to="/flex">FLEX</Link>
        </div>
        <div className="item">
          <Link to="/flexusd">FLEXUSD</Link>
        </div>
        <div className="item">
          <Link to="/flex-dao">FLEXDAO</Link>
        </div>
      </div>
    </div>
  )
}