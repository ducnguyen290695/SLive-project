import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Space, Button, Form, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

import BasicLayout from '@/src/layouts/BasicLayout';
import RestContent from '@/src/components/RestContent';
import {
  INPUT_TYPE,
  PAGE_SIZE_LIST,
  FORM_LAYOUT,
  DATE_FORMAT,
  GENDER,
} from '@/src/config/constants';
import FormInput from '@/src/components/FormInput';
import Stack from '@/src/components/Stack';
import styles from './index.module.css';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const Rank = () => {
  const { t } = useTranslation(['rank', 'common']);
  const [params, setParams] = useState({
    currentPage: 1,
    pageSize: 20,
    time: 'total',
    'filter[vip_type]': [],
    'filter[level]': null,
    sort: '',
  });
  const [isStackOpen, setIsStackOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [userDetailForm] = Form.useForm();
  const [levelSearchForm] = Form.useForm();
  const dispatch = useDispatch();

  const vipTypeOptions = ['none', 'bronze', 'silver', 'golden', 'platinum', 'diamond'];
  const timeOptions = ['daily', 'weekly', 'monthly', 'total'];

  const { data, fetching } = useSelector((state: any) => state.rankReducer?.fetch);

  const breadcrumb = [
    {
      name: t('common:home'),
    },
    {
      name: t('common:rank_management'),
    },
  ];

  const formFields = [
    {
      formItemOptions: {
        label: t('common:name'),
        name: 'name',
      },
      inputOptions: {
        placeholder: t('common:name'),
        readOnly: true,
      },
    },
    {
      formItemOptions: {
        label: 'Nick Name',
        name: 'nickname',
      },
      inputOptions: {
        placeholder: 'Nick Name',
        readOnly: true,
      },
    },
    {
      type: INPUT_TYPE.DATE_PICKER,
      formItemOptions: {
        label: t('birthday'),
        name: 'birthday',
      },
      inputOptions: {
        placeholder: t('birthday'),
        format: DATE_FORMAT,
        disabled: true,
      },
    },
    {
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        label: t('gender'),
        name: 'gender_id',
      },
      inputOptions: {
        placeholder: t('gender'),
        disabled: true,
        options: [
          {
            label: t(`${GENDER.MALE.LABEL}`),
            value: 1,
          },
          {
            label: t(`${GENDER.FEMALE.LABEL}`),
            value: 0,
          },
        ],
      },
    },
    {
      formItemOptions: {
        label: 'Email',
        name: 'email',
      },
      inputOptions: {
        placeholder: 'Email',
        readOnly: true,
      },
    },

    {
      formItemOptions: {
        label: t('address'),
        name: 'address',
      },
      inputOptions: {
        placeholder: t('address'),
        readOnly: true,
      },
    },
  ];

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: () => (
      <div style={{ padding: 8 }}>
        <Form form={levelSearchForm} onFinish={values => handleSearchLevel(values)}>
          <FormInput
            type={INPUT_TYPE.NUMBER}
            formItemOptions={{
              name: 'level',
              rules: [
                {
                  type: 'number',
                  min: 0,
                  message: t('level_min_0'),
                },
              ],
            }}
            inputOptions={{
              defaultValue: null,
            }}
          />
          <Space>
            <Button type="primary" size="small" style={{ width: 60 }} htmlType={'submit'}>
              {t('common:search')}
            </Button>
            <Button size="small" style={{ width: 60 }} onClick={onResetSearchLevel}>
              {t('common:reset')}
            </Button>
          </Space>
        </Form>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
  });

  const columns = [
    {
      title: t('common:no.'),
      dataIndex: 'no',
      key: 'no',
      width: 70,
      align: 'center',
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      align: 'center',
      render: (_, record) => (
        <div className={styles.idTag} key={`id${record?.id}`}>
          {record?.id}
        </div>
      ),
    },
    {
      title: t('common:name'),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        return <a onClick={() => openUserDetail(record)}>{record.user?.name}</a>;
      },
    },
    {
      title: 'Nick Name',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (_, record) => {
        return record.user?.nickname;
      },
    },
    {
      title: t('vip_type'),
      dataIndex: 'vip_type',
      key: 'vip_type',
      filters: vipTypeOptions.map(item => ({
        text: item,
        value: item,
      })),
      sorter: (a, b) => a.vip_type - b.vip_type,
    },
    {
      title: t('level'),
      dataIndex: 'level',
      key: 'level',
      sorter: (a, b) => a.level - b.level,
      ...getColumnSearchProps('level'),
    },
    {
      title: `${t('received_gift')} (${params.time})`,
      dataIndex: `${params.time}_received_gift`,
      key: 'received_gift',
      sorter: (a, b) => a.received_gift - b.received_gift,
    },
    {
      title: `${t('deposit')} (${params.time})`,
      dataIndex: `${params.time}_deposit`,
      key: 'deposit',
      sorter: (a, b) => a.deposit - b.deposit,
    },
  ];

  function openUserDetail(record) {
    let { name, address, birthday, email, gender_id } = record?.user;
    console.log({ record });
    setIsStackOpen(true);
    userDetailForm.setFieldsValue({
      name,
      address,
      birthday: birthday ? moment(birthday, DATE_FORMAT) : '',
      email,
      gender_id: gender_id === 0 ? GENDER.FEMALE.VALUE : GENDER.MALE.VALUE,
    });
  }

  function onResetSearchLevel() {
    levelSearchForm.resetFields();
    setParams({
      ...params,
      'filter[level]': null,
    });
  }

  function handleSearchLevel(values) {
    setParams({
      ...params,
      'filter[level]': values?.level,
    });
  }

  const onTableChange = (pagination, filters, sorter) => {
    const { vip_type } = filters;
    const { order, field } = sorter;
    setParams({
      ...params,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      'filter[vip_type]': vip_type,
      sort: !order ? '' : order === 'ascend' ? `${field}` : `-${field}`,
    });
  };

  const handleSearchTime = value => {
    setParams({
      ...params,
      time: value ? value : params.time,
    });
  };

  const fetchRank = () => {
    let { currentPage, pageSize, time, sort } = params;
    dispatch({
      type: 'FETCH_RANK_REQUEST',
      payload: {
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        time,
        sort,
        'filter[level]': params['filter[level]'],
        'filter[vip_type]': params['filter[vip_type]'],
      },
    });
  };

  useEffect(() => {
    fetchRank();
  }, [params]);

  useEffect(() => {
    setIsMobile(document.documentElement.clientWidth < 767 ? true : false);
  }, []);
  return (
    <BasicLayout breadcrumb={breadcrumb}>
      <div>
        <div className={styles.actionGroup}>
          <Select
            placeholder={t('time')}
            options={timeOptions.map(item => ({
              label: item,
              value: item,
            }))}
            defaultValue={'total'}
            className={styles.timeSelect}
            onChange={value => handleSearchTime(value)}
          />
        </div>

        <RestContent
          tableLoading={fetching}
          dataSource={
            data?.data?.result.map((item, index) => ({
              ...item,
              no: (params.currentPage - 1) * 20 + index + 1,
            })) || []
          }
          columns={columns}
          onTableChange={onTableChange}
          disabledSearchButton={fetching}
          pagination={{
            pageSize: params.pageSize,
            total: data?.data?.total || 0,
            showSizeChanger: true,
            pageSizeOptions: PAGE_SIZE_LIST,
            current: params.currentPage,
          }}
        />

        <Stack
          isStackOpen={isStackOpen}
          setIsStackOpen={setIsStackOpen}
          width={isMobile ? '100vw' : '600px'}
          title={t('user_detail')}
        >
          <Form {...FORM_LAYOUT} form={userDetailForm}>
            {formFields.map((field, index) => {
              return <FormInput key={index} {...field} />;
            })}
          </Form>
        </Stack>
      </div>
    </BasicLayout>
  );
};

export const getServerSideProps = async ({ locale, req }) => ({
  props: {
    ...(await serverSideTranslations(req?.language || locale)),
  },
});

export default Rank;
