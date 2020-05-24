/*
 * @Descripttion: 
 * @version: 
 * @Author: xiongyulun
 * @Date: 2020-05-23 23:20:22
 * @LastEditors: xiongyulun
 * @LastEditTime: 2020-05-24 23:33:16
 */ 
import React, { PureComponent } from 'react';
import { Select, Spin } from 'antd';
import { connect } from 'dva';

const { Option } = Select;

const nullSlectItem = {
  label: '',
  key: '',
};

@connect(({ citySelect }) => {
  const { province,  city ,isLoading} = citySelect;
  return {
    province,
    city,
    isLoading,
  };
})
class CitySelect extends PureComponent {
  componentDidMount = () => {
  
    const { dispatch } = this.props;
    if(location.href.indexOf("?")>-1){
      dispatch({
        type: 'citySelect/fetchCity',
        payload: this.props.selectProvince.key,
      });
    }
    
    
    dispatch({
      type: 'citySelect/fetchProvince',
    });
    
   
  };

  componentDidUpdate(props) {
    const { dispatch, value } = this.props;

    if (!props.value && !!value && !!value.province) {
      dispatch({
        type: 'citySelect/fetchCity',
        payload: value.province.key,
      });
    }
  }

  getProvinceOption() {
    const { province } = this.props;
    return this.getOption(province);
  }

  getCityOption = () => {
    const { city } = this.props;
    return this.getOption(city);
  };

  getOption = list => {
    if (!list || list.length < 1) {
      return (
        <Option key={0} value={0}>
          没有找到选项
        </Option>
      );
    }
    return list.map(item => (
      <Option key={item.id} value={item.id}>
        {item.name}
      </Option>
    ));
  };

  selectProvinceItem = item => {
    const { dispatch, onChange } = this.props;
    dispatch({
      type: 'citySelect/fetchCity',
      payload: item.key,
    });
    onChange({
      province: item,
      city: nullSlectItem,
    });
  };

  selectCityItem = item => {
    const { value, onChange } = this.props;

    if(value){
      onChange({
        province: value.province,
        city: item,
      });
    }else{
      onChange({
        province: this.props.selectProvince,
        city: item,
      });
    }
    
  };

  conversionObject() {
    const { value } = this.props;
    // console.log(this.props)
    if (!value) {
      return {
        province: this.props.selectProvince,
        city: this.props.selectCity,
      };
    }
    const { province, city } = value;
    return {
      province: province || nullSlectItem,
      city: city || nullSlectItem,
    };
  }

  render() {
    const { province, city } = this.conversionObject();
    // const province=this.props.selectProvince
    // const city=this.props.selectCity
    const { isLoading} = this.props;
    return (
      <Spin spinning={isLoading}>
        <Select
        //   className={styles.item}
          value={province}
          labelInValue
          showSearch
          onSelect={this.selectProvinceItem}
        >
          {this.getProvinceOption()}
        </Select>
        <Select
        //   className={styles.item}
          value={city}
          labelInValue
          showSearch
          onSelect={this.selectCityItem}
        >
          {this.getCityOption()}
        </Select>
      </Spin>
    );
  }
}

export default CitySelect;
