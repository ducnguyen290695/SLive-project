import React from 'react';
import { Input, InputNumber, Select, Form, DatePicker, Upload } from 'antd';
import MaskedInput from 'antd-mask-input';
import { INPUT_TYPE } from '@/src/config/constants';
import ImageUpload from '@/src/components/ImageUpload';
import PhoneInput from 'react-phone-number-input';

const FormInput = props => {
  const { type, formItemOptions, inputOptions, inputChildren } = props;

  const renderInput = type => {
    switch (type) {
      case INPUT_TYPE.TEXT_AREA:
        return <Input.TextArea {...inputOptions} />;
      case INPUT_TYPE.NUMBER:
        return <InputNumber {...inputOptions} />;
      case INPUT_TYPE.SELECT:
        return <Select {...inputOptions}>{inputChildren}</Select>;
      case INPUT_TYPE.MASKED_INPUT:
        return <MaskedInput {...inputOptions} />;
      case INPUT_TYPE.DATE_PICKER:
        return <DatePicker {...inputOptions} />;
      case INPUT_TYPE.PASSWORD:
        return <Input.Password {...inputOptions} />;
      case INPUT_TYPE.IMAGE_UPLOAD:
        return <ImageUpload {...inputOptions} />;
      case INPUT_TYPE.PHONE_INPUT:
        return <PhoneInput {...inputOptions} />;
      default:
        return <Input {...inputOptions} />;
    }
  };

  return <Form.Item {...formItemOptions}>{renderInput(type)}</Form.Item>;
};

export default FormInput;
