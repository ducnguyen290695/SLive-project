import React, { useState, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { useDispatch, useSelector } from 'react-redux';
import {
  notification,
  Button,
  Modal,
  Spin,
  Form,
  Input,
  Select,
  DatePicker, Space, Tooltip,
} from 'antd';
import type { RootState } from '@/src/redux/store';
import BasicLayout from '@/src/layouts/BasicLayout';
import RestContent from '../../../components/RestContent';
import { countIndex } from '@/src/utils/common';
import { PAGE_SIZE_LIST } from '@/src/config/constants';
import produce from 'immer';
import moment from 'moment';
import { createHotIdolAct, getAllHotIdolAct, resetAct } from '@/src/redux/hot_idol/actions';
import api from '@/src/utils/api';
import { USERS_URL } from '@/src/utils/urlConfig';
import { EditOutlined } from '@ant-design/icons';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const HotIdol = () => {
  const { t } = useTranslation(['hot_idol', 'common']);
  const dispatch = useDispatch();
  const hotIdolReducer = useSelector((state: RootState) => state.hotIdolReducer);
  const [pageNumber, setPageNumber] = useImmer<number>(1);
  const [itemPerPage, setItemPerPage] = useImmer<number>(20);
  const [isOpenModal, setIsOpenModal] = useImmer<any>(false);
  const [loading, setLoading] = useImmer<any>(false);
  const [currentItem, setCurrentItem] = useImmer<any>(null);
  const [listUser, setListUser] = useImmer<any>([]);
  const [listHotIdol, setListHotIdol] = useState({ list: [], total: 0 });
  const [formEdit] = Form.useForm();

  let resetPageNumber;

  useEffect(() => {
    getAllHotIdol(pageNumber, itemPerPage);
  }, []);

  const getUser = async (search: string) => {
    const param = {
      skip: 0,
      limit: 10,
      search: {
        name: search,
      },
    };
    try {
      setLoading(true);
      await api.get({ url: USERS_URL, params: param }).then(res => res.data).then(result => {
        const list = result.data?.users.map(item => ({
          value: item?.id,
          label: item?.name,
        }));
        setListUser(list);
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getUserById = async (id: string) => {
    try {
      setLoading(true);
      await api.get({ url: `${USERS_URL}/${id}` }).then(res => res.data).then(result => {
        const list = [{
          value: result?.data?.id,
          label: result?.data?.name,
        }];
        setListUser(list);
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getAllHotIdol = (page?: number, limit?: number, searchParam?) => {
    const search = {
      ...searchParam,
    };
    dispatch(getAllHotIdolAct({ skip: (page - 1) * limit, limit, search }));
  };

  useEffect(() => {
    if (hotIdolReducer?.listHotIdol?.total !== 0) {
      setListHotIdol(produce(listHotIdol, draft => {
        draft.list = hotIdolReducer?.listHotIdol?.result || [];
        draft.total = hotIdolReducer?.listHotIdol?.total || 0;
      }));
    }
  }, [hotIdolReducer?.listHotIdol?.total, hotIdolReducer?.listHotIdol?.result]);

  useEffect(() => {
    if (hotIdolReducer?.isError) {
      notification.error({
        message: t('common:Error'),
        description: hotIdolReducer?.error?.response?.data?.message || '',
        duration: 2.5,
      });
      dispatch(resetAct());
    }
  }, [hotIdolReducer?.isError]);

  useEffect(() => {
    if (hotIdolReducer?.isSuccess) {
      if (isOpenModal) {
        setIsOpenModal(null);
      }
      formEdit.resetFields();
      setPageNumber(1);
      resetPageNumber();
      dispatch(resetAct());
    }
  }, [hotIdolReducer?.isSuccess]);

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
    width: 70,
    align: 'center',
    render: (text, record) => <div className={'tag-table'} key={`id${record?.id}`}>{record?.id}</div>,
  }, {
    title: t('idol'),
    align: 'center',
    dataIndex: 'idol',
    sorter: (a, b) => a.user.name.localeCompare(b.user.name),
    render: (text, record) => <span key={`name${record?.id}`}>{record?.user?.name}</span>,
  }, {
    title: t('index'),
    align: 'center',
    dataIndex: 'index',
    sorter: (a, b) => a?.index - b?.index,
    render: (text, record) => <span key={`index${record?.id}`}>{record?.index}</span>,
  }, {
    title: t('time_end'),
    dataIndex: 'time_end',
    align: 'center',
    width: 300,
    sorter: (a, b) => moment(a.time_end).unix() - moment(b.time_end).unix(),
    render: (text, record) => <span>{moment(record?.time_end).format('DD/MM/YYYY HH:mm:ss')}</span>,
  }, {
    title: t('common:created_at'),
    dataIndex: 'created_at',
    align: 'center',
    width: 250,
    sorter: (a, b) => moment(a.created_at).unix() - moment(b.created_at).unix(),
    render: (text, record) => <span>{moment(record?.created_at).format('DD/MM/YYYY HH:mm:ss')}</span>,
  }, {
    title: t('common:action'),
    width: 150,
    dataIndex: 'action',
    align: 'center',
    render: (text, record) =>
      <Space>
        <Tooltip title={t('common:modify')}>
          <Button type='primary' onClick={() => {
            getUserById(record?.user?.id);
            formEdit.setFieldsValue({
              user_id: record?.user?.id,
              time_end: moment(record?.time_end),
              index: record?.index,
            });
            setCurrentItem(record);
            setIsOpenModal(true);
          }} shape='circle' icon={<EditOutlined />} size={'middle'} />
        </Tooltip>
      </Space>
    ,
  }];

  const breadcrumb = [
    {
      name: t('common:home'),
    },
    {
      name: t('common:users_management'),
    },
    {
      name: t('common:hot_idol_management'),
    },
  ];

  const actions = [
    <Button type='primary' onClick={() => {
      getUser('');
      formEdit.resetFields();
      setIsOpenModal(true);
    }}>
      {t('add_idol')}
    </Button>,
  ];

  const onTableChange = (pagination, filters, sorter, search) => {
    if (pagination?.pageSize !== itemPerPage || pagination?.current !== pageNumber) {
      setItemPerPage(pagination?.pageSize);
      setPageNumber(pagination?.current);
      getAllHotIdol(pagination?.current, pagination?.pageSize, search);
    }
  };

  const handleSearch = (values) => {
    setPageNumber(1);
    getAllHotIdol(1, itemPerPage, values);
  };

  const searchFields = [];

  const handleCloseModal = () => {
    setCurrentItem(null);
    setIsOpenModal(null);
    formEdit.resetFields();
  };
  const handleSubmit = async () => {
    await formEdit.validateFields();
    const val = await formEdit.getFieldsValue();
    const body = {
      index: val?.index,
      user_id: val?.user_id || '',
      time_end: moment(val?.time_end).toISOString(),
    };
    dispatch(createHotIdolAct(body));
  };

  function disabledDate(current) {
    return current < moment().startOf('day');
  }

  let timmer = null;
  const handleSearchUser = (value) => {
    clearTimeout(timmer);
    timmer = setTimeout(() => {
      getUser(value);
    }, 500);
  };

  return (
    <>
      <BasicLayout breadcrumb={breadcrumb}>
        <Spin spinning={hotIdolReducer?.loading || false}>
          <RestContent
            resetPageNumber={(res: any) => resetPageNumber = res}
            tableLoading={hotIdolReducer?.isLoading || false}
            dataSource={listHotIdol?.list || []}
            searchFields={searchFields}
            columns={columns}
            onTableChange={onTableChange}
            onSearch={handleSearch}
            actions={actions}
            keyItem={'id'}
            pagination={{
              current: pageNumber,
              pageSize: itemPerPage,
              total: listHotIdol?.total || 0,
              showSizeChanger: true,
              pageSizeOptions: PAGE_SIZE_LIST,
            }}
          />
          <Modal title={t('add_modal')} visible={isOpenModal} onCancel={handleCloseModal}
                 onOk={handleSubmit}>
            <Spin spinning={hotIdolReducer?.loading || false}>
              <Form form={formEdit}>
                <Form.Item label={t('idol')} name='user_id' className={'w-100'}
                           rules={[{ required: true, message: t('common:require_field') }]}>
                  <Select
                    showSearch
                    placeholder={t('search_idol')}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    disabled={currentItem}
                    loading={loading}
                    filterOption={false}
                    onSearch={handleSearchUser}
                    notFoundContent={null}
                  >
                    {listUser.length > 0 && listUser.map(d => <Select.Option key={d.value}
                                                                             value={d.value}>{d.label}</Select.Option>)}
                  </Select>
                </Form.Item>
                <Form.Item label={t('time_end')} name='time_end' className={'w-100'}
                           rules={[{ required: true, message: t('common:require_field') }]}>
                  <DatePicker
                    format='YYYY-MM-DD HH:mm:ss'
                    disabledDate={disabledDate}
                    showTime={{ defaultValue: moment(moment().format('HH:mm:ss'), 'HH:mm:ss') }}
                  />
                </Form.Item>
                <Form.Item label={t('index')} name='index' className={'w-100'}
                           rules={[{ required: true, message: t('common:require_field') }]}>
                  <Input placeholder={t('index')} type={'number'} className={'w-100'} />
                </Form.Item>
              </Form>
            </Spin>
          </Modal>
        </Spin>
      </BasicLayout>
    </>
  );
};

export const getServerSideProps = async ({ locale, req }) => ({
  props: {
    ...(await serverSideTranslations(req?.language || locale)),
  },
});

export default HotIdol;

