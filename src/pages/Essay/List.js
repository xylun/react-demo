/*
 * @Descripttion:
 * @version:
 * @Author: xiongyulun
 * @Date: 2020-05-22 11:01:29
 * @LastEditors: xiongyulun
 * @LastEditTime: 2020-05-24 23:39:31
 */

import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Table, Button,message } from 'antd';
import styles from './List.less';

@connect(({ essay, loading }) => ({
  essay,
  loading: loading.models.essay,
}))
class Essay extends Component {
  state = {
    selectedRows: [],
  };

  columns = [
    {
      title: '题目',
      dataIndex: 'title',
      key: 'title',
      render: (text,record) => <a href="javascript:" onClick={() => {this.gotoEditEssay(record)}}>{text}</a>,
    },
    {
      title: '过期时间',
      dataIndex: 'expirationTime',
      key: 'expirationTime',
    },
    {
      title: '发布城市',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
    },
    // {
    //   title: '操作',
    //   dataIndex: 'operation',
    //   key: 'operation',
    //   render: text => <a>{text}</a>,
    // },
  ];

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({
        selectedRows,
      });
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'essay/fetch',
    });
  }

  gotoEditEssay = (data) => {
    console.log(data)
    const { dispatch } = this.props;
    if(data){
      const cityData=data.city.split("-")
      router.push(`/essay/edit?id=${data.key}&province=${cityData[0]}&provinceKey=${data.provinceKey}&city=${cityData[1]}&cityKey=${data.cityKey}`);
    }else{
      router.push(`/essay/edit`);
    }
    
  };


  delEssay = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {return message.warning('请至少选择一篇文章');}
    dispatch({
      type: 'essay/remove',
      payload: {
        key: selectedRows.map(row => row.key),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  render() {
    return (
      <div>
        <div className={styles.btn_container}>
          <Button
            type="primary"
            className={styles.btn_add}
            onClick={() => {
              this.gotoEditEssay();
            }}
          >
            增加
          </Button>
          <Button
            type="danger"
            className={styles.btn_del}
            onClick={() => {
              this.delEssay();
            }}
          >
            删除
          </Button>
        </div>

        <Table
          dataSource={this.props.essay.data.list}
          columns={this.columns}
          rowSelection={this.rowSelection}
        />
      </div>
    );
  }
}

export default Essay;
