import { useEffect, useState } from "react";
import { Table, Tag, Typography } from "antd";
import * as config from '../config.json';
import { errorHandle } from "../utils";

const { Paragraph } = Typography;
const getItems = (config) => {
  let items = [];
  const iterate = (obj) => {
    for (let key in obj) {
      if (key === "summary") {
        console.log(obj[key]);
        items.push(obj[key]);
      }
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        iterate(obj[key])
      }
    }
  }
  iterate(config);
  return items;
}
export function Summary() {

  const [data, setData] = useState([]);
  
  const columns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Contracts Address',
      dataIndex: 'address',
      key: 'address',
      render: address => (<Paragraph copyable>{address}</Paragraph>)
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: tags => (
        <>
          {tags.map(tag => {
            let color;
            switch (tag) {
              case 'Prod':
                color = 'green';
                break;
              case 'Stg':
                color = 'cyan';
                break;
              case 'PP':
                color = 'volcano'
                break;
              case 'SmartBCH':
                color = 'gold';
                break;
              case 'Ethereum':
                color = 'geekblue';
                break;
              case 'Polygon':
                color = 'magenta'
                break;
              case 'Famtom':
                color = 'purple'
                break;
              case 'BSC':
                color = 'lime'
                break;
              case 'Avax':
                color = 'red'
                break;
              default:
                color = "blue"
            }
            return (
              <Tag color={color} key={tag}>
                {tag}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <a href={record.url}>More Detail</a>
      ),
    },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        if (config) {
          const data = getItems(config);
          setData(data);
        }
        
      } catch (err) {
        errorHandle("summary page initial", err);
      }
    }
    fetchData();
    return () => {
    }
  }, []);

  return (
    <div className="container">
      <div className="box">
        <Table columns={columns} dataSource={data} pagination={{ defaultPageSize: 10}} />
      </div>
    </div>
  );
}
