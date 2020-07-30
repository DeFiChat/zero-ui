import React from 'react';
import { Form, Input, Button, Select } from 'antd';

const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

class Bond extends React.Component {
  formRef = React.createRef();

  onAssetChange = value => {
    this.formRef.current.setFieldsValue({
      note: `PREFERENCE: ${value === 'long' ? 'DURATION' : 'LIQUIDITY'}`,
    });
  };

  onFinish = values => {
    console.log(values);
  };

  onReset = () => {
    this.formRef.current.resetFields();
  };

  onFill = () => {
    this.formRef.current.setFieldsValue({
      info: 'TIMESWAP',
      time: 'NOW (*)',
    });
  };

  render() {
    return (
      <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
        <Form.Item
          name="info"
          label="Info"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="time"
          label="Time"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder="Select preference"
            onChange={this.onAssetChange}
            allowClear
          >
            <Option value="short">SHORT</Option>
            <Option value="other">NEUTRAL</Option>
            <Option value="long">LONG</Option>            
          </Select>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.time !== currentValues.time}
        >
          {({ getFieldValue }) =>
            getFieldValue('Time') === 'other' ? (
              <Form.Item
                name="customizeAsset"
                label="Customize Asset"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            ) : null
          }
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Bond
          </Button>
          <Button htmlType="button" onClick={this.onReset}>
            Reset
          </Button>
          <Button type="link" htmlType="button" onClick={this.onFill}>
            Fill form
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Bond