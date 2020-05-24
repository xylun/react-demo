/*
 * @Descripttion:
 * @version:
 * @Author: xiongyulun
 * @Date: 2020-05-23 10:39:06
 * @LastEditors: xiongyulun
 * @LastEditTime: 2020-05-24 18:58:45
 */

import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 20; i += 1) {
  tableListDataSource.push({
    key: i,
    title: `文章${i}`,
    expirationTime: '2020-5-23 9:00',
    city: '湖北省-武汉',
    provinceKey:'420000',
    cityKey:'420100',
    content: `内容${i}`,
    operation: `编辑`,
  });
}

function getEssay(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  let dataSource = tableListDataSource;

  //   if (params.sorter) {
  //     const s = params.sorter.split('_');
  //     dataSource = dataSource.sort((prev, next) => {
  //       if (s[1] === 'descend') {
  //         return next[s[0]] - prev[s[0]];
  //       }
  //       return prev[s[0]] - next[s[0]];
  //     });
  //   }

  //   if (params.status) {
  //     const status = params.status.split(',');
  //     let filterDataSource = [];
  //     status.forEach(s => {
  //       filterDataSource = filterDataSource.concat(
  //         dataSource.filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
  //       );
  //     });
  //     dataSource = filterDataSource;
  //   }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }
  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };
  return res.json(result);
}

function postEssay(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const body = (b && b.body) || req.body;
  const { method,key, id, title, expirationTime, city,provinceKey,cityKey, content } = body;
  console.log("body",body)
  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        title,
        expirationTime,
        city,
        provinceKey,
        cityKey,
        content,
        operation: `编辑`,
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.key == id) {
          Object.assign(item, { title, expirationTime, city,provinceKey,cityKey, content});

          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }
  return getEssay(req, res, u);
}

function getEssayDetail(req, res) {
   tableListDataSource.map(item => {
    if (item.key == req.body.id) {
      return res.json(item);
     
    } 
  });
}

export default {
  'GET /api/essay': getEssay,
  'POST /api/essay': postEssay,
  'POST /api/essayDetail': getEssayDetail,
};
