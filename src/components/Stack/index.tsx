import React, { useState } from 'react';
import styles from './index.module.css';
import { CloseOutlined } from '@ant-design/icons';

const Stack = props => {
  const { children, setIsStackOpen, isStackOpen, width, title } = props;

  const closeStack = () => {
    setIsStackOpen && setIsStackOpen(false);
  };

  return (
    <React.Fragment>
      <div
        className={styles.stack}
        style={{ right: isStackOpen ? 0 : `-${width}`, width: `${width}` }}
      >
        <div className={styles.stackHeader}>
          <h4>{title}</h4>
          <CloseOutlined onClick={closeStack} />
        </div>
        {children}
      </div>

      <div hidden={!isStackOpen} className={styles.maskLayer} onClick={closeStack}></div>
    </React.Fragment>
  );
};

export default Stack;
