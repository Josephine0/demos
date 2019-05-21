import React, {PureComponent, Component} from 'react';
import { Button, Radio, Input, Upload, message, Icon, Layout } from 'antd';
import axios from 'axios';
import './index.less';

const RadioGroup = Radio.Group;
const { Content } = Layout

export default class Home extends React.Component {
  state = {
    value: 1,
    type: 'single',
    fileList: [],
    uploading: false,
    id: ''
  }
  // 切换审核结果
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }
  // 切换审核类型
  onChangeType = (e) => {
    this.setState({
      type: e.target.value,
      id: ''
    });
  }
  // 设置code
  setId = (e) => {
    this.setState({
      id: e.target.value,
    });
  }
  // 上传审核结果
  handleUpload = () => {
    const { fileList } = this.state;
    const config =  {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    const formData = new FormData();
    formData.append('file', fileList[0]);
    formData.append('codes', this.state.id);
    formData.append('status', this.state.value);

    this.setState({
      uploading: true,
    });
    axios.post('/api/c2c/audit', formData, config).then((res) => {
      let msgList = [
        '对，你没看错，就是上传成功了！<(￣︶￣)>',
        '(☆▽☆)成功了吗？成功了！',
        '成功了！是不是很好用！(๑•̀ㅂ•́)و✧',
        '别激动，千万别激动，就是成功了！ щ(ﾟДﾟщ)',
        'm9(`Д´) 快看，又成功了！',
        '─=≡Σ(((つ•̀ω•́)つ可真棒棒！',
        '┐(ﾟ～ﾟ)┌ So Easy~',
        '憋笑了，(;￢＿￢) ！，成功了！',
        '（o´ﾟ□ﾟ`o）成功了呢',
        '(oﾟ▽ﾟ)o祝早日下线！',
        '喝不喝酒？(σ｀д′)σ'
      ]
      if (res.data.msg.toLowerCase() == 'ok') {
        message.success(msgList[Math.floor(Math.random() * 11)])
      } else {
        message.error('(╯°□°）╯︵┻━┻报错了，我也不知道为啥');
      }
      this.setState({
        fileList: [],
        uploading: false,
      });
    }).catch((res) => {
      message.error(`(╯°□°）╯︵┻━┻报错了，因为：${res.data.msg}-${res.data.data}`);
      this.setState({
        uploading: false
      });
    })
  }

  render() {
    let uploadType;
    const { uploading, fileList } = this.state;
    const Dragger = Upload.Dragger;

    const props = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      disabled: fileList.length == 1,
      beforeUpload: (file) => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };
    if (this.state.type == 'single') {
      uploadType = (
        <Input placeholder="Basic usage" value={this.state.id} onChange={this.setId}/>
      )
    } else {
      uploadType = (
        <div>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">点击或拖拽上传文件</p>
          </Dragger>
        </div>
      )
    }
    return (
      <Layout className="home">
        <Content className="home-content">
          <div>
            <RadioGroup onChange={this.onChangeType} value={this.state.type}>
              <Radio value={'single'}>单个审核</Radio>
              <Radio value={'all'}>批量审核</Radio>
            </RadioGroup>
          </div>
          <div>
            {uploadType}
          </div>
          <div>
            <RadioGroup onChange={this.onChange} value={this.state.value}>
              <Radio value={1}>审核通过</Radio>
              <Radio value={-1}>审核不通过</Radio>
            </RadioGroup>
          </div>
          <Button
              type="primary"
              onClick={this.handleUpload}
              disabled={fileList.length === 0 && this.state.id === ''}
              loading={uploading}
              style={{ marginTop: 16 }}
            >
              {uploading ? '上传中' : '上传审核结果' }
          </Button>
        </Content>
      </Layout>
    );
  }
}