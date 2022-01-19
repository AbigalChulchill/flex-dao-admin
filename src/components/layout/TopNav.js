import { Link } from 'react-router-dom';

export const TopNav = ({category}) => {
  if (category === 'FlexPage') {
    return (
      <div className="topbar">
          <div className="item">
            <Link to="/flex/pp">{category}-PP</Link>
          </div>
          <div className="item">
            <Link to="/flex/stg2">{category}-stg</Link>
          </div>
          <div className="item">
            <Link to="/flex/prod">{category}-prod</Link>
        </div>
      </div>
    )
  } else if (category === 'FlexUsdPage') {
    return (
      <div className='topbar'>
        {category}-top-nav-coming
      </div>
    )
  } else if (category === 'FlexDaoPage') {
    return (
      <div className="topbar">
          <div className="item">
            <Link to="/flex-dao/pp">{category}-PP</Link>
          </div>
          {/* <div className="item">
            <Link to="/flex-dao/stg1">{category}-stg1</Link>
          </div> */}
          <div className="item">
            <Link to="/flex-dao/stg2">{category}-stg</Link>
          </div>
          {/* <div className="item">
            <Link to="/flex-dao/stg3">{category}-stg3</Link>
          </div> */}
          <div className="item">
            <Link to="/flex-dao/prod">{category}-prod</Link>
        </div>
      </div>
    )
  } else {
    return (
      <div>{category} not found</div>
    )
  }
}