import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { useDispatch, useSelector } from 'react-redux';
import { notification, Input, Row, Col, DatePicker, Tag } from 'antd';
import type { RootState } from '@/src/redux/store';
import BasicLayout from '@/src/layouts/BasicLayout';
import RestContent from '../../components/RestContent';
import { countIndex, deleteNullOrUndefinedInObject, formatNumber, getDescendantProp } from '@/src/utils/common';
import moment from 'moment';
import { PAGE_SIZE_LIST } from '@/src/config/constants';
import { getAllTransactionsAct, resetAct } from '@/src/redux/transactions/actions';
import styles from './index.module.css';
import produce from 'immer';
import { groupBy } from '@/src/utils/common';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const iconForCurrency = {
  diamond: '/diamond.png',
  gold: '/gold.png',
};

const Transactions = () => {
  const { t } = useTranslation(['transaction', 'common'])
  const dispatch = useDispatch();
  const transactionsReducer = useSelector((state: RootState) => state.transactionsReducer);
  const [pageNumber, setPageNumber] = useImmer<number>(1);
  const [itemPerPage, setItemPerPage] = useImmer<number>(20);
  const [formState, setFormState] = useState({ startDate: null, endDate: null });
  const [listTransactions, setListTransactions] = useState({ list: [], total: 0 });
  const [listCurrency, setListCurrency] = useImmer([]);
  const [filter, setFilter] = useState({ status: null, type: null, 'currency.name': null });
  const [searchString, setSearchString] = useImmer<string | null>('');
  const [totalAmount, setTotalAmount] = useImmer([]);

  const typeList = [
    {
      text: t('deposit'),
      value: 'deposit',
    },
    {
      text: t('withDraw'),
      value: 'withdraw',
    },
    {
      text: t('convert'),
      value: 'convert',
    },
    {
      text: t('buyGift'),
      value: 'buy_gift',
    },
    {
      text: t('receiveGift'),
      value: 'receive_gift',
    },
    {
      text: t('gameReward'),
      value: 'game_reward',
    },
    {
      text: t('gameDeposit'),
      value: 'game_deposit',
    },
  ];

  const statusList = [
    {
      text: t('pending'),
      value: 'pending',
    },
    {
      text: t('approved'),
      value: 'approved',
    },
    {
      text: t('success'),
      value: 'success',
    },
    {
      text: t('rejected'),
      value: 'rejected',
    },
    {
      text: t('failed'),
      value: 'failed',
    },
    {
      text: t('cancelled'),
      value: 'cancelled',
    },
  ];

  useEffect(() => {
    getAllTransactions(pageNumber, itemPerPage);
  }, []);

  const getAllTransactions = (page?: number, limit?: number, search?) => {
    if (search) {
      Object.keys(search).forEach(key => search[key] === undefined && delete search[key]);
    }
    dispatch(getAllTransactionsAct({ skip: (page - 1) * limit, limit, search }));
  };

  useEffect(() => {
    if (transactionsReducer?.isError) {
      notification.error({
        message: 'Error',
        description: transactionsReducer?.error?.response?.data?.message || '',
        duration: 2.5,
      });
      dispatch(resetAct());
    }
  }, [transactionsReducer?.isError]);

  useEffect(() => {
    if (listTransactions.list.length > 0) {
      const newObjectGroup = groupBy(listTransactions.list, 'currency.name');
      const totalAmountArray = [];
      Object.keys(newObjectGroup).forEach(item => {
        const totalPlus = newObjectGroup[item].reduce((a, b) => {
          return a + (b.amount > 0 ? b.amount : 0);
        }, 0);
        if(totalPlus !== 0) {
          totalAmountArray.push(<span key={`amount${item}-${totalPlus}`} className={`${styles.tagCurrency} ${styles[item]}`}>
          <Image
            alt={`${item}`}
            width={12}
            height={12}
            src={iconForCurrency[item]}
          />
            {`${formatNumber(totalPlus)}`}</span>);
        }
        const totalMinus = newObjectGroup[item].reduce((a, b) => {
          return a + (b.amount < 0 ? b.amount : 0);
        }, 0);
        if (totalMinus !== 0) {
          totalAmountArray.push(<span key={`amount${item}-${totalMinus}`} className={`${styles.tagCurrency} ${styles.red}`}>
          <Image
            alt={`${item}`}
            width={12}
            height={12}
            src={iconForCurrency[item]}
          />
            {`${formatNumber(totalMinus)}`}</span>);
        }
      });

      setTotalAmount(totalAmountArray);
    }
  }, [listTransactions?.list]);

  useEffect(() => {
    if (transactionsReducer?.listTransactions?.total !== 0) {
      const transactionsList = transactionsReducer?.listTransactions?.transactions || [];
      if (transactionsList.length > 0) {
        const setOfCurrency: any = new Map(transactionsList.map(i =>
          [i?.currency?.name, { text: i?.currency?.name, value: i?.currency?.name }])).values();
        const listCurrencyFilter = [...setOfCurrency];
        setListCurrency(listCurrencyFilter);
      }
      setListTransactions(produce(listTransactions, draft => {
        draft.list = transactionsReducer?.listTransactions?.transactions || [];
        draft.total = transactionsReducer?.listTransactions?.total || 0;
      }));
    }
  }, [transactionsReducer?.listTransactions?.total, transactionsReducer?.listTransactions?.transactions]);

  const _renderStatus = status => {
    switch (status) {
      case 'pending':
        return <span className={`tag-table ${styles.tagDiv} ${styles.orange}`}>{t('pending')}</span>;
      case 'approved':
        return <span className={`tag-table ${styles.tagDiv} ${styles.approved}`}>{t('approved')}</span>;
      case 'success':
        return <span className={`tag-table ${styles.tagDiv} ${styles.green}`}>{t('success')}</span>;
      case 'rejected':
        return <span className={`tag-table ${styles.tagDiv} ${styles.rejected}`}>{t('rejected')}</span>;
      case 'failed':
        return <span className={`tag-table ${styles.tagDiv} ${styles.red}`}>{t('failed')}</span>;
      case 'cancelled':
        return <span className={`tag-table ${styles.tagDiv} ${styles.gray}`}>{t('cancelled')}</span>;
      default:
        return '';
    }
  };

  const _renderType = type => {
    switch (type) {
      case 'deposit':
        return t('deposit');
      case 'withdraw':
        return t('withDraw');
      case 'convert':
        return t('convert');
      case 'buy_gift':
        return t('buyGift');
      case 'receive_gift':
        return t('receiveGift');
      case 'game_reward':
        return t('gameReward');
      case 'game_deposit':
        return t('gameDeposit');
      default:
        return '';
    }
  };

  const columns = [{
    title: t('common:no.'),
    dataIndex: 'no',
    width: 70,
    align: 'center',
    render: (text, record, index) => <span
      key={`no${record?.id}`}>{countIndex(index + 1, pageNumber, itemPerPage)}</span>,
  }, {
    title: 'ID',
    dataIndex: 'id',
    align: 'center',
    width: 100,
    render: (text, record) => <div className={'tag-table'} key={`id${record?.id}`}>{record?.id}</div>,
  }, {
    title: t('common:name'),
    dataIndex: 'name',
    align: 'center',
    sorter: (a, b) => a.user.name.localeCompare(b.user.name),
    render: (text, record) => <span key={`name${record?.id}`}>{record?.user?.name || ''}</span>,
  }, {
    title: t('type'),
    dataIndex: 'type',
    align: 'center',
    filters: typeList,
    filteredValue: filter?.type || null,
    sorter: (a, b) => a.type.localeCompare(b.type),
    render: (text, record) => <span>{_renderType(record?.type || '')}</span>,
  }, {
    title: t('amount'),
    dataIndex: 'amount',
    align: 'center',
    sorter: (a, b) => a.amount - b.amount,
    render: (text, record) => <div
      className={`${record?.amount < 0 ? styles.colorRed : styles.colorGreen}`}>{formatNumber(record?.amount || 0)}</div>,
  }, {
    title: t('currencyUnit'),
    dataIndex: 'currency.name',
    align: 'center',
    filters: listCurrency,
    sorter: (a, b) => a.type.localeCompare(b.type),
    filteredValue: filter?.['currency.name'] || null,
    render: (text, record) => <span key={`currency_id_name${record?.id}`}>{record?.currency?.name || ''}</span>,
  }, {
    title: t('common:status'),
    dataIndex: 'status',
    align: 'center',
    filters: statusList,
    sorter: (a, b) => a.status.localeCompare(b.status),
    filteredValue: filter?.status || null,
    render: (text, record) => _renderStatus(record?.status || ''),
  }, {
    title: t('common:updated_at'),
    width: 200,
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
      name: t('common:transaction_management'),
    },
  ];

  const onTableChange = (pagination, filters, sorter, search) => {
    if (pagination?.pageSize !== itemPerPage || pagination?.current !== pageNumber) {
      setItemPerPage(pagination?.pageSize);
      setPageNumber(pagination?.current);
      getAllTransactions(pagination?.current, pagination?.pageSize, search);
      setFilter({ status: null, type: null, 'currency.name': null });
    } else if (Object.keys(filters).length > 0) {
      let list = filterNewList(filters);
      if (searchString !== '') {
        list = list.filter(a => a?.user?.name.toLowerCase().includes(searchString.toLowerCase() || ''));
      }
      setListTransactions(produce(listTransactions, draft => {
        draft.list = list || [];
        draft.total = list.length || 0;
      }));
      setFilter(filters);
    }
  };

  const handleSearch = (values) => {
    setPageNumber(1);
    getAllTransactions(1, itemPerPage, values);
  };

  const handleFilterDate = (e) => {
    if (e && e[0] && e[1]) {
      setFormState(produce(formState, draft => {
        draft.startDate = e[0];
        draft.endDate = e[1];
      }));
      setPageNumber(1);
      getAllTransactions(1, itemPerPage, {
        from: moment(e[0]).utc().toISOString(),
        to: moment(e[1]).utc().toISOString(),
      });
      setFilter({ status: null, type: null, 'currency.name': null });
    } else {
      setFormState(produce(formState, draft => {
        draft.startDate = null;
        draft.endDate = null;
      }));
      setPageNumber(1);
      setFilter({ status: null, type: null, 'currency.name': null });
      getAllTransactions(1, itemPerPage);
    }
  };

  let timer: any;
  const handleChangeText = e => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setSearchString(e.target.value);
      if (e.target.value) {
        const list = filterNewList(filter);
        const newList = list.filter(a => a?.user.name.toLowerCase().includes(e.target.value.toLowerCase() || ''));
        setListTransactions(produce(listTransactions, draft => {
          draft.list = newList || [];
          draft.total = newList.length || 0;
        }));
      } else {
        const list = filterNewList(filter);
        setListTransactions(produce(listTransactions, draft => {
          draft.list = list || [];
          draft.total = list.length !== itemPerPage ? list.length : transactionsReducer?.listTransactions?.total || 0;
        }));
      }
    }, 200);
  };

  const filterNewList = filterInit => {
    const filterObj = deleteNullOrUndefinedInObject(filterInit);
    let newList = transactionsReducer?.listTransactions?.transactions || [];
    if (filterObj) {
      newList = newList.filter(item => {
        let count = 0;
        Object.keys(filterObj).forEach(key => {
          if (filterObj[key].includes(getDescendantProp(item, key))) {
            count += 1;
          }
        });
        return count === Object.keys(filterObj).length;
      });
    }
    return newList;
  };

  const { RangePicker } = DatePicker;

  function disabledDate(current) {
    return current > moment().add(1, 'day').startOf('day');
  }

  return (
    <>
      <BasicLayout breadcrumb={breadcrumb}>
        <>
          <Row className={styles.rowSearch} gutter={[24, 24]} justify={'start'}>
            <Col xxl={6} xl={10} lg={18} md={24} sm={24} xs={24} style={{ flexDirection: 'row' }}>
              <span>{t('common:name')}:</span>{' '}
              <Input onChange={handleChangeText} allowClear={true}
                     placeholder={t('common:name')} className={'w-70'} />
            </Col>
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
          {totalAmount.length > 0 && (
            <Row className={styles.rowSearch}>
            <span
              className={styles.totalAmount}>{t('total_amount')}:</span> {totalAmount.length > 0 && totalAmount.map(z => z)}
            </Row>
          )}
          <RestContent
            tableLoading={transactionsReducer?.isLoading || false}
            dataSource={listTransactions?.list || []}
            searchFields={[]}
            columns={columns}
            onTableChange={onTableChange}
            onSearch={handleSearch}
            actions={[]}
            keyItem={'id'}
            pagination={{
              current: pageNumber,
              pageSize: itemPerPage,
              total: listTransactions?.total || 0,
              showSizeChanger: true,
              pageSizeOptions: PAGE_SIZE_LIST,
            }}
          />
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

export default Transactions;
