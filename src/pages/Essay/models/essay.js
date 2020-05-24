/*
 * @Descripttion: 
 * @version: 
 * @Author: xiongyulun
 * @Date: 2020-05-23 11:16:04
 * @LastEditors: xiongyulun
 * @LastEditTime: 2020-05-24 19:02:23
 */ 
import { queryEssay,addEssay,removeEssay,queryEssayDetail,updateEssay} from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'essay',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryEssay, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(addEssay, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      message.success('增加成功');
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeEssay, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      message.success('删除成功');
      if (callback) callback();
    },
    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(queryEssayDetail, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *update({ payload }, { call, put }) {
      const response = yield call(updateEssay, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      message.success('修改成功');
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
