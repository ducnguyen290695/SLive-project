import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { useDispatch, useSelector } from 'react-redux';
import { notification } from 'antd';
import type { RootState } from '@/src/redux/store';
import BasicLayout from '@/src/layouts/BasicLayout';
import RestContent from '../../../components/RestContent';
import { countIndex, formatNumber } from '@/src/utils/common';
import moment from 'moment';
import { PAGE_SIZE_LIST } from '@/src/config/constants';
import { language } from '@/src/utils/en';
import { getAllUserBannedAct, resetAct } from '@/src/redux/user-banned/actions';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const UserBanned = () => {
  const { t } = useTranslation(['user_banned', 'common']);
  const dispatch = useDispatch();
  const userBannedReducer = useSelector((state: RootState) => state.userBannedReducer);
  const [pageNumber, setPageNumber] = useImmer<number>(1);
  const [itemPerPage, setItemPerPage] = useImmer<number>(20);

  useEffect(() => {
    getAllUserBanned(pageNumber, itemPerPage);
  }, []);

  const getAllUserBanned = (page?: number, limit?: number, search?) => {
    const currentDate = moment().toDate();
    dispatch(getAllUserBannedAct({
      skip: (page - 1) * limit, limit, filter: {
        banned_until: {
          gte: currentDate,
        },
      },
    }));
  };

  useEffect(() => {
    if (userBannedReducer?.isError) {
      notification.error({
        message: t('common:Error'),
        description: userBannedReducer?.error?.response?.data?.message || '',
        duration: 2.5,
      });
      dispatch(resetAct());
    }
  }, [userBannedReducer?.isError]);

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
    title: t('reason'),
    dataIndex: 'reason',
    align: 'center',
    render: (text, record) => <span key={`name${record?.id}`}>{record?.reason || ''}</span>,
  }, {
    title: t('banned_until'),
    dataIndex: 'banned_until',
    align: 'center',
    render: (text, record) => <span>{moment(record?.banned_until).format('DD/MM/YYYY HH:mm:ss')}</span>,
  }, {
    title: t('common:name'),
    dataIndex: 'username',
    align: 'center',
    render: (text, record) => <span key={`user_id${record?.id}`}>{record?.user_id || ''}</span>,
  }, {
    title: t('common:created_at'),
    width: 200,
    dataIndex: 'created_at',
    align: 'center',
    render: (text, record) => <span>{moment(record?.created_at).format('DD/MM/YYYY HH:mm:ss')}</span>,
  }];

  const breadcrumb = [
    {
      name: t('common:home'),
    },
    {
      name: t('common:user_banned'),
    },
  ];

  const onTableChange = (pagination, filters, sorter) => {
    setItemPerPage(pagination?.pageSize);
    setPageNumber(pagination?.current);
    getAllUserBanned(pagination?.current, pagination?.pageSize);
  };

  return (
    <>
      <BasicLayout breadcrumb={breadcrumb}>
        <RestContent
          tableLoading={userBannedReducer?.isLoading || false}
          dataSource={userBannedReducer?.listUserBanned?.result || []}
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
            total: userBannedReducer?.listUserBanned?.total || 0,
            showSizeChanger: true,
            pageSizeOptions: PAGE_SIZE_LIST,
          }}
        />
      </BasicLayout>
    </>
  );
};

export const getServerSideProps = async ({ locale, req }) => ({
  props: {
    ...(await serverSideTranslations(req?.language || locale)),
  },
});

export default UserBanned;
