import {
  TeamOutlined,
  GiftOutlined,
  WalletOutlined,
  PictureOutlined,
  InteractionOutlined,
  BarChartOutlined,
  MoneyCollectOutlined,
  ClusterOutlined,
} from '@ant-design/icons';
import { ROLES } from '@/src/config/constants';

const routes = [
  {
    key: 'User',
    title: 'users_management',
    icon: <TeamOutlined />,
    children: [
      {
        key: 'UserDetail',
        title: 'users_management',
        icon: <TeamOutlined />,
        path: '/users',
        accessRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
      {
        key: 'Idol',
        title: 'idol_management',
        icon: <TeamOutlined />,
        path: '/users/idol',
        accessRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
      {
        key: 'UserBanned',
        title: 'user_banned',
        icon: <TeamOutlined />,
        path: '/users/user-banned',
        accessRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
      {
        key: 'HotIdol',
        title: 'hot_idol_management',
        icon: <TeamOutlined />,
        path: '/users/hot-idol',
        accessRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
      {
        key: 'UserWallets',
        title: 'users_wallet_management',
        icon: <TeamOutlined />,
        path: '/users/user-wallet',
        accessRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
    ],
  },
  {
    key: 'Gift',
    title: 'gift_management',
    path: '/gifts',
    icon: <GiftOutlined />,
    accessRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    key: 'Room',
    title: 'room',
    icon: <WalletOutlined />,
    children: [
      {
        key: 'RoomDetail',
        title: 'room',
        icon: <WalletOutlined />,
        path: '/room',
        accessRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
      {
        key: 'RoomCategory',
        title: 'room_category',
        icon: <WalletOutlined />,
        path: '/room/room-category',
        accessRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
    ],
  },
  {
    key: 'Banners',
    title: 'banner_management',
    path: '/banners',
    icon: <PictureOutlined />,
    accessRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    key: 'Transactions',
    title: 'transaction_management',
    path: '/transactions',
    icon: <InteractionOutlined />,
    accessRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    key: 'Rank',
    title: 'rank_management',
    path: '/ranks',
    icon: <BarChartOutlined />,
    accessRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    key: 'WithDraw',
    title: 'withdraw_management',
    path: '/with-draw',
    accessRoles: [ROLES.SUPER_ADMIN],
    icon: <MoneyCollectOutlined />,
  },
  {
    key: 'Permission',
    title: 'permission',
    path: '/permission',
    accessRoles: [ROLES.SUPER_ADMIN],
    icon: <ClusterOutlined />,
  },
];

export default routes;
