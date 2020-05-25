/*
 * @Descripttion:
 * @version:
 * @Author: xiongyulun
 * @Date: 2020-05-22 11:01:51
 * @LastEditors: xiongyulun
 * @LastEditTime: 2020-05-26 01:39:52
 */

import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';

import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import moment from 'moment';

import { Form, Input, Card, DatePicker, Select, Button } from 'antd';
import CitySelect from './CitySelect';
import styles from './Edit.less';

const { Option } = Select;
const FormItem = Form.Item;

const validatorGeographic = (rule, value, callback) => {
  if (value) {
    const { province, city } = value;
    if (!province.key) {
      callback('Please input your province!');
    }
    if (!city.key) {
      callback('Please input your city!');
    }
  }
  callback();
};

@connect(({ essay, loading }) => ({
  essay,
  loading: loading.models.essay,
}))
@Form.create()
class EssayEdit extends Component {
  componentDidMount() {
    const { dispatch, location, form} = this.props;
    if (this.props.location.query.id) {
      const params = {
        id: location.query.id,
      };
      dispatch({
        type: 'essay/fetchDetail',
        payload: params,
      }).then(() => {
        console.log(this.props);
        const province=(this.props.essay.data.city.split("-"))[0]
        const city=(this.props.essay.data.city.split("-"))[1]
        form.setFieldsValue({
          title: this.props.essay.data.title,
          expirationTime: moment(this.props.essay.data.expirationTime),
          // geographic:{province:this.props.selectProvince.label},selectProvince}
          geographic: {
            city: { key: this.props.essay.data.cityKey, label: province },
            province: { key: this.props.essay.data.provinceKey, label: city },
          },
        });

        const contentBlock = htmlToDraft(this.props.essay.data.content);
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.setState({ editorState });
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    let values = {};
    let title = '';
    let city = '';
    let provinceKey = '';
    let cityKey = '';
    this.props.form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue);
      if (fieldsValue.title) {
        title = fieldsValue.title;
      } else {
        return;
      }

      if (fieldsValue.expirationTime) {
        values = {
          expirationTime: fieldsValue.expirationTime.format('YYYY-MM-DD HH:mm:ss'),
        };
      } else {
        return;
      }

      if (
        fieldsValue.geographic &&
        fieldsValue.geographic.province.key &&
        fieldsValue.geographic.city.key
      ) {
        city = `${fieldsValue.geographic.province.label}-${fieldsValue.geographic.city.label}`;
        provinceKey = fieldsValue.geographic.province.key;
        cityKey = fieldsValue.geographic.city.key;
      } else {
        return;
      }

      if (this.props.location.query.id) {
        const params = {
          id: this.props.location.query.id,
          title: fieldsValue.title,
          expirationTime: values.expirationTime,
          content: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
          city,
          provinceKey,
          cityKey,
        };
        dispatch({
          type: 'essay/update',
          payload: params,
        }).then(() => {
          router.push(`/essay`);
        });
      } else {
        const params = {
          title: fieldsValue.title,
          expirationTime: values.expirationTime,
          content: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
          city,
          provinceKey,
          cityKey,
        };
        dispatch({
          type: 'essay/add',
          payload: params,
        }).then(() => {
          router.push(`/essay`);
        });
      }
    });
  };

  state = {
    showRichText: false,
    editorContent: '',
    editorState: EditorState.createEmpty(),
    selectProvince: {
      key: this.props.location.query.provinceKey || '',
      label: this.props.location.query.province || '',
    },
    selectCity: {
      key: this.props.location.query.cityKey || '',
      label: this.props.location.query.city || '',
    },
  };

  handleClearContent = () => {
    // 清空文本
    this.setState({
      editorState: '',
    });
  };

  handleGetText = () => {
    // 获取文本内容
    this.setState({
      showRichText: true,
    });
  };

  onEditorStateChange = editorState => {
    // 编辑器的状态
    this.setState({
      editorState,
    });
  };

  onEditorChange = editorContent => {
    // 编辑器内容的状态
    this.setState({
      editorContent,
    });
  };

  cancel = () => {
    router.push(`/essay`);
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const config = {
      rules: [{ type: 'object', required: true, message: '请选择时间' }],
    };

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label={<span>文章标题;</span>}>
          {getFieldDecorator('title', {
            rules: [{ required: true, message: '请输入文章标题!', whitespace: true }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="过期时间">
          {getFieldDecorator('expirationTime', config)(
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" className={styles.expirationTime} />
          )}
        </Form.Item>
        <Form.Item label="文章内容">
          <Editor
            editorState={this.state.editorState}
            wrapperClassName="content_wrapper"
            editorClassName={styles.content_editor}
            onEditorStateChange={this.onEditorStateChange}
          />
        </Form.Item>
        <FormItem label={formatMessage({ id: 'app.settings.basic.geographic' })}>
          {getFieldDecorator('geographic', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'app.settings.basic.geographic-message' }, {}),
              },
              {
                validator: validatorGeographic,
              },
            ],
          })(
            <CitySelect
              selectProvince={this.state.selectProvince}
              selectCity={this.state.selectCity}
            />
          )}
        </FormItem>
        <FormItem
          wrapperCol={{
            xs: { span: 10, offset: 0 },
            sm: { span: 10, offset: 7 },
          }}
        >
          {/* <div className={styles.btn_container}> */}
          <Button type="primary" htmlType="submit" loading={submitting} className={styles.mr_20}>
            提交
          </Button>
          <Button
            onClick={() => {
              this.cancel();
            }}
          >
            取消
          </Button>
          {/* </div> */}
        </FormItem>
      </Form>
    );
  }
}

export default EssayEdit;
