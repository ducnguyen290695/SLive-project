import React from 'react';
import styles from './index.module.css';
import Image from 'next/image';

const Spin = ({ spinning, tip }) => {
  return (
    spinning && (
      <div className={styles.spin}>
        <div className={styles.content}>
          <Image src="/Spinner.gif" alt="Picture of the author" width={100} height={100} />
          <span className={styles.tip}>{tip}</span>
        </div>
      </div>
    )
  );
};

export default Spin;
