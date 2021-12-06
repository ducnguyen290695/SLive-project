import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import styles from './index.module.css';

const UserInfo = ({ name, email, phone }) => {
  return (
    <div>
      <div>
        <UserOutlined /> {name}
      </div>

      <div className={styles.email}>
        <MailOutlined />
        <span>{email}</span>
      </div>

      <div className={styles.phone}>
        <PhoneOutlined />
        <span>{phone}</span>
      </div>
    </div>
  );
};

export default UserInfo;
