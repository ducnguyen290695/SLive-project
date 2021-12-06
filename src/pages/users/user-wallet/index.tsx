import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { useDispatch, useSelector } from 'react-redux';
import { notification, Row, Col, DatePicker, Descriptions, Image } from 'antd';
import type { RootState } from '@/src/redux/store';
import BasicLayout from '@/src/layouts/BasicLayout';
import RestContent from '../../../components/RestContent';
import {
  countIndex,
  formatNumber,
  groupBy,
} from '@/src/utils/common';
import moment from 'moment';
import { GENDER, PAGE_SIZE_LIST } from '@/src/config/constants';
import { getAllUserWalletAct, resetAct } from '@/src/redux/user_wallet/actions';
import { language } from '@/src/utils/en';
import styles from './index.module.css';
import produce from 'immer';
import Stack from '@/src/components/Stack';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const UserWallet = () => {
  const { t } = useTranslation(['user_wallet', 'common'])
  const dispatch = useDispatch();
  const userWalletReducer = useSelector((state: RootState) => state.userWalletReducer);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [itemPerPage, setItemPerPage] = useState<number>(20);
  const [formState, setFormState] = useState({ startDate: null, endDate: null });
  const [listUserWallets, setListUserWallet] = useState({ list: [], total: 0 });
  const [listCurrency, setListCurrency] = useImmer([]);
  const [isStackOpen, setIsStackOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setIsMobile(document.documentElement.clientWidth < 767);
  }, []);

  useEffect(() => {
    getAllUserWallet(pageNumber, itemPerPage);
  }, []);

  const getAllUserWallet = (page?: number, limit?: number, search?) => {
    dispatch(getAllUserWalletAct({ skip: (page - 1) * limit, limit, ...search }));
  };

  useEffect(() => {
    if (userWalletReducer?.isError) {
      notification.error({
        message: t('common:Error'),
        description: userWalletReducer?.error?.response?.data?.message || '',
        duration: 2.5,
      });
      dispatch(resetAct());
    }
  }, [userWalletReducer?.isError]);

  useEffect(() => {
    const newList = [];
    const listOfCurrency = [];
    if (userWalletReducer?.listUserWallet?.total !== 0 && userWalletReducer?.listUserWallet?.wallets && userWalletReducer?.listUserWallet?.wallets.length > 0) {
      const userWalletList = userWalletReducer?.listUserWallet?.wallets || [];
      if (userWalletList.length > 0) {
        const setOfCurrency: any = new Map(userWalletList.map(i =>
          [i?.currency?.name, { text: i?.currency?.name, value: i?.currency?.name }])).values();
        const listCurrencyFilter = [...setOfCurrency];
        setListCurrency(listCurrencyFilter);
      }
      const listGroupByUser = groupBy(userWalletReducer?.listUserWallet?.wallets, 'user.id') || {};
      Object.keys(listGroupByUser).forEach(item => {
        const listInUser = listGroupByUser[item];
        const listGroupByCurrency = groupBy(listInUser, 'currency.name');
        const exist = userWalletReducer?.listUserWallet?.wallets.find(az => Number(az?.user?.id) === Number(item));
        const itemConsumer: { [k: string]: any } = { ...exist };

        let timeUpdatedAt = 14484667000;
        Object.keys(listGroupByCurrency).forEach(itemInCurrency => {
          if (itemInCurrency !== 'usd' && itemInCurrency !== 'vnd') {
            listOfCurrency.push(itemInCurrency);
          }
          const itemCurrency = listGroupByCurrency[itemInCurrency];
          itemConsumer[`${itemInCurrency}`] = itemCurrency.reduce((a, b) => {
            if (moment(b?.updated_at).unix() > moment(timeUpdatedAt).unix()) {
              timeUpdatedAt = b?.updated_at;
            }
            if (itemInCurrency !== 'usd' && itemInCurrency !== 'vnd') {
              return a + (b.balance > 0 ? b.balance : 0);
            }
            return a;
          }, 0);
          itemConsumer[`updated_at`] = timeUpdatedAt;
        });
        newList.push(itemConsumer);
      });
    }
    const mapOfCurrency: any = new Set(listOfCurrency);
    const newListOfCurrency = [...mapOfCurrency];
    setListCurrency(newListOfCurrency);
    setListUserWallet(produce(listUserWallets, draft => {
      draft.list = newList || [];
      draft.total = userWalletReducer?.listUserWallet?.total || 0;
    }));
  }, [userWalletReducer?.listUserWallet?.total, userWalletReducer?.listUserWallet?.wallets]);

  const handleViewUserDetail = user => {
    setCurrentUser(user);
    setIsStackOpen(true);
  };

  const columns = [{
    title: t('common:no.'),
    dataIndex: 'no',
    width: 150,
    align: 'center',
    render: (text, record, index) => <span
      key={`no${record?.id}`}>{countIndex(index + 1, pageNumber, itemPerPage)}</span>,
  }, {
    title: t('common:name'),
    dataIndex: 'user.name',
    align: 'center',
    sorter: (a, b) => a.user.name.localeCompare(b.user.name),
    render: (text, record) => <div onClick={() => handleViewUserDetail(record?.user)} key={`name${record?.id}`}
                                   className={styles.link}>{record?.user?.name || ''}</div>,
  }, {
    title: t('common:updated_at'),
    width: 250,
    dataIndex: 'created_at',
    sorter: (a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix(),
    align: 'center',
    render: (text, record) => <span>{moment(record?.updated_at).format('DD/MM/YYYY HH:mm:ss')}</span>,
  }];

  const breadcrumb = [
    {
      name: t('common:home'),
    },
    {
      name: t('common:users_management'),
    },
    {
      name: t('common:users_wallet_management'),
    },
  ];

  const onTableChange = (pagination) => {
    setItemPerPage(pagination?.pageSize);
    setPageNumber(pagination?.current);
    let filter = {};
    if (formState?.startDate && formState?.endDate) {
      filter = {
        updated_at: {
          between: {
            from: moment(formState?.startDate).utc().toISOString(),
            to: moment(formState?.endDate).utc().toISOString(),
          },
        },
      };
    }
    getAllUserWallet(pagination?.current, pagination?.pageSize, { filter });

  };

  const handleFilterDate = (e) => {
    if (e && e[0] && e[1]) {
      setFormState(produce(formState, draft => {
        draft.startDate = e[0];
        draft.endDate = e[1];
      }));
      setPageNumber(1);
      getAllUserWallet(1, itemPerPage, {
        filter: {
          updated_at: {
            between: {
              from: moment(e[0]).utc().toISOString(),
              to: moment(e[1]).utc().toISOString(),
            },
          },
        },
      });
    } else {
      setFormState(produce(formState, draft => {
        draft.startDate = null;
        draft.endDate = null;
      }));
      setPageNumber(1);
      getAllUserWallet(1, itemPerPage);
    }
  };

  const { RangePicker } = DatePicker;

  function disabledDate(current) {
    return current > moment().add(1, 'day').startOf('day');
  }

  if (listCurrency.length > 0) {
    listCurrency.forEach(currency => {
      columns.splice(2, 0, {
        title: currency,
        dataIndex: currency,
        width: 250,
        sorter: (a, b) => (a[currency] || 0) - (b[currency] || 0),
        align: 'center',
        render: (text, record) => <span>{formatNumber(record[currency] || 0) || 0}</span>,
      });
    });
  }

  return (
    <>
      <BasicLayout breadcrumb={breadcrumb}>
        <>
          <Row className={styles.rowSearch} gutter={[24, 24]} justify={'start'}>
            <Col xxl={10} xl={14} lg={18} md={24} sm={24} xs={24}>
              <span>{t('dateRange')}: </span>{' '}
              <RangePicker onChange={handleFilterDate} format={'DD-MM-YYYY'}
                           ranges={{
                             [`1 ${t('day')}`]: [moment().subtract(1, 'day'), moment()],
                             [`1 ${t('week')}`]: [moment().subtract(1, 'week'), moment()],
                             [`1 ${t('month')}`]: [moment().subtract(1, 'month'), moment()],
                           }}
                           disabledDate={disabledDate} />
            </Col>
          </Row>
          <RestContent
            tableLoading={userWalletReducer?.isLoading || false}
            dataSource={listUserWallets?.list || []}
            searchFields={[]}
            columns={columns}
            onTableChange={onTableChange}
            onSearch={() => {
            }}
            actions={[]}
            keyItem={'id'}
            pagination={{
              current: pageNumber,
              pageSize: itemPerPage,
              total: listUserWallets?.total || 0,
              showSizeChanger: true,
              pageSizeOptions: PAGE_SIZE_LIST,
            }}
          />
          <Stack
            isStackOpen={isStackOpen}
            setIsStackOpen={setIsStackOpen}
            width={isMobile ? '100vw' : '600px'}
            title={t('user_detail')}
          >
            <div className={styles.detailContainer}>
              {currentUser?.avatar && (<Image
                width={150}
                className={styles.avatar}
                src={currentUser?.avatar}
              />)}
              <Descriptions title='' column={1}>
                <Descriptions.Item label='ID'>{currentUser?.id}</Descriptions.Item>
                <Descriptions.Item label={t('common:name')}>{currentUser?.name}</Descriptions.Item>
                <Descriptions.Item label='Nickname'>{currentUser?.nickname}</Descriptions.Item>
                <Descriptions.Item
                  label={t('gender')}>{currentUser?.gender_id === 0 ? t(`${GENDER.FEMALE.LABEL}`) : t(`${GENDER.MALE.LABEL}`)}</Descriptions.Item>
                <Descriptions.Item label={t('phone_number')}>{currentUser?.phone}</Descriptions.Item>
                <Descriptions.Item label='Email'>{currentUser?.email}</Descriptions.Item>
                <Descriptions.Item label={t('birthday')}>{currentUser?.birthday}</Descriptions.Item>
              </Descriptions>
            </div>
          </Stack>
        </>
      </BasicLayout>
    </>
  );
};

export const getServerSideProps = async ({ locale, req }) => ({
  props: {
    ...(await serverSideTranslations(req?.language || locale)),
  },
});

export default UserWallet;
