import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const ImageUpload = props => {
  const {
    showUploadList,
    className,
    listType,
    getFile,
    maxSize,
    defaultImage,
    required,
    accept,
    disabled,
    imageUrl,
    setImageUrl,
    onChange,
  } = props;
  const [loading, setLoading] = useState(false);
  // const [imageUrl, setImageUrl] = useState('');

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = file => {
    getFile(file);
  };

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imgUrl => {
        setImageUrl(imgUrl);
        setLoading(false);
      });
    }
    onChange(info);
  };

  return (
    <React.Fragment>
      <Upload
        name="avatar"
        listType={listType}
        className={className}
        showUploadList={showUploadList}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        accept={accept}
        disabled={disabled}
      >
        {/* {defaultImage ? (
          <img src={defaultImage} alt="image" style={{ width: '100%' }} />
        ) : imageUrl ? ( */}
        {imageUrl ? <img src={imageUrl} alt="image" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
      {!imageUrl && required?.show && (
        <span style={{ color: 'rgb(255 77 79)' }}>{required?.message}</span>
      )}
    </React.Fragment>
  );
};

export default ImageUpload;
