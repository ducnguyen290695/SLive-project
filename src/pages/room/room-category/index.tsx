import React, { useState, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { useDispatch, useSelector } from 'react-redux';
import { notification, Button, Modal, Spin, Form, Input, Select, Tooltip, Space } from 'antd';
import type { RootState } from '@/src/redux/store';
import BasicLayout from '@/src/layouts/BasicLayout';
import RestContent from '../../../components/RestContent';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { countIndex } from '@/src/utils/common';
import { PAGE_SIZE_LIST } from '@/src/config/constants';
import produce from 'immer';
import {
  getAllRoomCategoryAct,
  resetAct,
  deleteRoomCategoryAct,
  modifyRoomCategoryAct,
  createRoomCategoryAct,
} from '@/src/redux/room_category/actions';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const RoomCategory = () => {
  const { t } = useTranslation(['room_category', 'common']);
  const dispatch = useDispatch();
  const roomCategoryReducer = useSelector((state: RootState) => state.roomCategoryReducer);
  const [pageNumber, setPageNumber] = useImmer<number>(1);
  const [itemPerPage, setItemPerPage] = useImmer<number>(20);
  const [isOpenModal, setIsOpenModal] = useImmer<any>(false);
  const [currentItem, setCurrentItem] = useImmer<any>(null);
  const [listRoomCategory, setListRoomCategory] = useState({ list: [], total: 0 });
  const [formEdit] = Form.useForm();

  let resetPageNumber;

  useEffect(() => {
    getAllRoomCategory(pageNumber, itemPerPage);
  }, []);

  const getAllRoomCategory = (page?: number, limit?: number, searchParam?) => {
    const search = {
      ...searchParam,
    };
    dispatch(getAllRoomCategoryAct({ skip: (page - 1) * limit, limit, search }));
  };

  useEffect(() => {
    if (roomCategoryReducer?.listRoomCategory?.total !== 0) {
      setListRoomCategory(produce(listRoomCategory, draft => {
        draft.list = roomCategoryReducer?.listRoomCategory?.categories || [];
        draft.total = roomCategoryReducer?.listRoomCategory?.total || 0;
      }));
    }
  }, [roomCategoryReducer?.listRoomCategory?.total, roomCategoryReducer?.listRoomCategory?.categories]);

  useEffect(() => {
    if (roomCategoryReducer?.isError) {
      notification.error({
        message: t('common:Error'),
        description: roomCategoryReducer?.error?.response?.data?.message || '',
        duration: 2.5,
      });
      dispatch(resetAct());
    }
  }, [roomCategoryReducer?.isError]);

  useEffect(() => {
    if (roomCategoryReducer?.isSuccess) {
      if (isOpenModal) {
        setIsOpenModal(null);
      }
      formEdit.resetFields();
      setPageNumber(1);
      resetPageNumber();
      dispatch(resetAct());
    }
  }, [roomCategoryReducer?.isSuccess]);

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
    title: t('category_name'),
    align: 'center',
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (text, record) => <span key={`name${record?.id}`}>{record?.name}</span>,
  }, {
    title: t('common:created_at'),
    dataIndex: 'created_at',
    align: 'center',
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
            formEdit.setFieldsValue({ name: record?.name });
            setCurrentItem(record);
            setIsOpenModal(true);
          }} shape='circle' icon={<EditOutlined />} size={'middle'} />
        </Tooltip>
        <Tooltip title={t('common:delete')}>
          <Button type='ghost' onClick={() => handleDelete(record?.id)} shape='circle' icon={<DeleteOutlined />}
                  size={'middle'} />
        </Tooltip>
      </Space>
    ,
  }];

  const handleDelete = (id: number) => {
    const deleteRecord = async () => {
      dispatch(deleteRoomCategoryAct(id));
    };
    Modal.confirm({
      title: t('common:Confirm'),
      content: t('common:confirm_delete'),
      onOk: deleteRecord,
    });
  };

  const breadcrumb = [
    {
      name: t('common:home'),
    },
    {
      name: t('common:room'),
    },
    {
      name: t('common:room_category'),
    },
  ];

  const actions = [
    <Button type='primary' onClick={() => {
      formEdit.resetFields();
      setCurrentItem(null);
      setIsOpenModal(true);
    }}>
      {t('add_category')}
    </Button>,
  ];

  const onTableChange = (pagination, filters, sorter, search) => {
    if (pagination?.pageSize !== itemPerPage || pagination?.current !== pageNumber) {
      setItemPerPage(pagination?.pageSize);
      setPageNumber(pagination?.current);
      getAllRoomCategory(pagination?.current, pagination?.pageSize, search);
    }
  };

  const handleSearch = (values) => {
    setPageNumber(1);
    getAllRoomCategory(1, itemPerPage, values);
  };

  const searchFields = [
    {
      formItemOptions: {
        label: t('category_name'),
        name: 'name',
      },
      inputOptions: {
        placeholder: t('category_name'),
      },
    },
  ];

  const handleCloseModal = () => {
    setIsOpenModal(null);
    formEdit.resetFields();
  };
  const handleSubmit = async () => {
    await formEdit.validateFields();
    const val = await formEdit.getFieldsValue();
    if (currentItem) {
      const body = {
        id: currentItem?.id,
        name: val?.name || '',
      };
      dispatch(modifyRoomCategoryAct(body));
    } else {
      const body = {
        name: val?.name || '',
      };
      dispatch(createRoomCategoryAct(body));
    }
  };

  return (
    <>
      <BasicLayout breadcrumb={breadcrumb}>
        <Spin spinning={roomCategoryReducer?.loading || false}>
          <RestContent
            resetPageNumber={(res: any) => resetPageNumber = res}
            tableLoading={roomCategoryReducer?.isLoading || false}
            dataSource={listRoomCategory?.list || []}
            searchFields={searchFields}
            columns={columns}
            onTableChange={onTableChange}
            onSearch={handleSearch}
            actions={actions}
            keyItem={'id'}
            pagination={{
              current: pageNumber,
              pageSize: itemPerPage,
              total: listRoomCategory?.total || 0,
              showSizeChanger: true,
              pageSizeOptions: PAGE_SIZE_LIST,
            }}
          />
          <Modal title={currentItem ? t('edit_category') : t('add_category')} visible={isOpenModal} onCancel={handleCloseModal}
                 onOk={handleSubmit}>
            <Spin spinning={roomCategoryReducer?.loading || false}>
              <Form form={formEdit}>
                <Form.Item label={'Name'} name='name' className={'w-100'}
                           rules={[{ required: true, message: t('common:require_field') }]}>
                  <Input placeholder={'Name'} className={'w-100'} />
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

export default RoomCategory;

