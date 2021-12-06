import React, { useState, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { useDispatch, useSelector } from 'react-redux';
import { notification, Button, Modal, Spin, Form, Input, Select, Tooltip, Space } from 'antd';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  deleteRoomAct,
  getAllRoomsAct,
  modifyRoomAct,
  resetAct,
  getAllRoomCategoryAct,
} from '@/src/redux/rooms/actions';
import type { RootState } from '@/src/redux/store';
import BasicLayout from '@/src/layouts/BasicLayout';
import RestContent from '../../components/RestContent';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { countIndex, deleteNullOrUndefinedInObject, getDescendantProp } from '@/src/utils/common';
import { PAGE_SIZE_LIST } from '@/src/config/constants';
import styles from './index.module.css';
import produce from 'immer';

const Room = () => {
  const { t } = useTranslation(['room', 'common']);
  const dispatch = useDispatch();
  const roomsReducer = useSelector((state: RootState) => state.roomsReducer);
  const [pageNumber, setPageNumber] = useImmer<number>(1);
  const [itemPerPage, setItemPerPage] = useImmer<number>(20);
  const [isOpenEditModal, setIsOpenEditModal] = useImmer<any>(null);
  const [formEdit] = Form.useForm();
  const [listRooms, setListRooms] = useState({ list: [], total: 0 });
  const [listOwner, setListOwner] = useImmer([]);
  const [listCategories, setListCategories] = useImmer([]);
  const [filter, setFilter] = useState({ status: null, 'owner.name': null, 'room_category.name': null });
  const [searchString, setSearchString] = useImmer<string | null>('');

  let resetPageNumber;

  const statusList = [
    {
      text: t('prepare'),
      value: 0,
    },
    {
      text: t('broadcasting'),
      value: 1,
    },
    {
      text: t('closed'),
      value: 2,
    },
  ];

  useEffect(() => {
    getAllRooms(pageNumber, itemPerPage);
    getAllCategories();
  }, []);

  const getAllRooms = (page?: number, limit?: number, search?) => {
    dispatch(getAllRoomsAct({ skip: (page - 1) * limit, limit, search }));
  };

  const getAllCategories = () => {
    dispatch(getAllRoomCategoryAct({}));
  };

  useEffect(() => {
    if (roomsReducer?.isError) {
      notification.error({
        message: t('common:Error'),
        description: roomsReducer?.error?.response?.data?.message || '',
        duration: 2.5,
      });
      dispatch(resetAct());
    }
  }, [roomsReducer?.isError]);


  useEffect(() => {
    if (roomsReducer?.listRooms?.total !== 0) {
      const roomsList = roomsReducer?.listRooms?.rooms || [];
      if (roomsList.length > 0) {
        const setOfOwner: any = new Map(roomsList.map(i =>
          [i?.owner?.name, { text: i?.owner?.name, value: i?.owner?.name }])).values();
        const listOwnerFilter = [...setOfOwner];
        const setOfCategory: any = new Map(roomsList.map(i =>
          [i?.room_category?.name || '', {
            text: i?.room_category?.name || '',
            value: i?.room_category?.name || '',
          }])).values();
        const listCategoryFilter = [...setOfCategory];
        setListOwner(listOwnerFilter);
        setListCategories(listCategoryFilter);
      }
      setListRooms(produce(listRooms, draft => {
        draft.list = roomsReducer?.listRooms?.rooms || [];
        draft.total = roomsReducer?.listRooms?.total || 0;
      }));
    }
  }, [roomsReducer?.listRooms?.total, roomsReducer?.listRooms?.rooms]);

  useEffect(() => {
    if (roomsReducer?.isSuccess) {
      if (isOpenEditModal) {
        setIsOpenEditModal(null);
      }
      formEdit.resetFields();
      dispatch(resetAct());
      getAllRooms(pageNumber, itemPerPage);
    }
  }, [roomsReducer?.isSuccess]);

  const _renderStatus = (item) => {
    switch (Number(item?.state)) {
      case 0:
        return (<span className={styles.tagStatus + ' ' + styles.orange}>{t('prepare')}</span>);
      case 1:
        return (<span className={styles.tagStatus + ' ' + styles.green}>{t('broadcasting')}</span>);
      case 2:
        return (<span className={styles.tagStatus + ' ' + styles.red}>{t('closed')}</span>);
    }
    return '';
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
    width: 70,
    align: 'center',
    render: (text, record) => <div className={'tag-table'} key={`id${record?.id}`}>{record?.id}</div>,
  }, {
    title: t('room_name'),
    align: 'center',
    dataIndex: 'room_name',
    width: 250,
    sorter: (a, b) => a.room_name.localeCompare(b.room_name),
    render: (text, record) => <span key={`room_name${record?.id}`}>{record?.room_name}</span>,
  }, {
    title: t('memberInRoom'),
    dataIndex: 'audiences',
    align: 'center',
    width: 250,
    sorter: (a, b) => a?.audiences.length - b?.audiences.length,
    render: (text, record) => <span
      key={`audiences${record?.id}`}>{record?.audiences && record?.audiences.length || 0}</span>,
  }, {
    title: t('common:status'),
    dataIndex: 'state',
    align: 'center',
    width: 250,
    filters: statusList,
    sorter: (a, b) => a?.state - b?.state,
    filteredValue: filter?.status || null,
    render: (text, record) => _renderStatus(record),
  }, {
    title: t('category'),
    dataIndex: 'room_category.name',
    align: 'center',
    width: 250,
    filters: listCategories,
    sorter: (a, b) => (a?.room_category?.name || '').localeCompare(b?.room_category?.name || ''),
    filteredValue: filter['room_category.name'] || null,
    render: (text, record) => <span
      key={`room_category${record?.id}`}>{record?.room_category?.name}</span>,
  }, {
    title: t('owner'),
    dataIndex: 'owner.name',
    align: 'center',
    width: 250,
    sorter: (a, b) => a.owner.name.localeCompare(b.owner.name),
    filters: listOwner,
    filteredValue: filter?.['owner.name'] || null,
    render: (text, record) => <span key={`owner${record?.id}`}>{record?.owner?.name || ''}</span>,
  }, {
    title: t('common:action'),
    width: 150,
    dataIndex: 'action',
    align: 'center',
    render: (text, record) =>
      <Space>

        <Tooltip title={t('common:modify')}>
          <Button type='primary' onClick={() => {
            formEdit.setFieldsValue({
              room_name: record?.room_name,
              state: record?.state,
              room_category_id: record?.room_category_id || record?.room_category?.id,
            });
            setIsOpenEditModal(record);
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
      dispatch(deleteRoomAct(id));
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
  ];

  const actions = [];

  const onTableChange = (pagination, filters, sorter, search) => {
    if (pagination?.pageSize !== itemPerPage || pagination?.current !== pageNumber) {
      setItemPerPage(pagination?.pageSize);
      setPageNumber(pagination?.current);
      getAllRooms(pagination?.current, pagination?.pageSize, search);
      setFilter({ 'owner.name': null, status: null, 'room_category.name': null });
      setSearchString('');
    } else {
      let list = filterNewList(filters);
      if (searchString !== '') {
        list = list.filter(a => a?.room_name.toLowerCase().includes(searchString.toLowerCase() || ''));
      }
      setListRooms(produce(listRooms, draft => {
        draft.list = list || [];
        draft.total = list.length || 0;
      }));
      setFilter(filters);
    }
  };

  const handleSearch = (values) => {
    if (values?.room_name) {
      const list = filterNewList(filter);
      const newList = list.filter(a => a?.room_name.toLowerCase().includes(values?.room_name.toLowerCase() || ''));
      setListRooms(produce(listRooms, draft => {
        draft.list = newList || [];
        draft.total = newList.length || 0;
      }));
      setSearchString(values?.room_name);
    } else {
      const list = filterNewList(filter);
      setListRooms(produce(listRooms, draft => {
        draft.list = list || [];
        draft.total = list.length !== itemPerPage ? list.length : roomsReducer?.listRooms?.total || 0;
      }));
      setSearchString('');
    }
  };

  const filterNewList = filterInit => {
    const filterObj = deleteNullOrUndefinedInObject(filterInit);
    let newList = roomsReducer?.listRooms?.rooms || [];
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

  const searchFields = [
    {
      formItemOptions: {
        label: t('room_name'),
        name: 'room_name',
      },
      inputOptions: {
        placeholder: t('room_name'),
      },
    },
  ];

  const handleCloseModal = () => {
    setIsOpenEditModal(null);
    formEdit.resetFields();
  };
  const handleEditItem = async () => {
    await formEdit.validateFields();
    const val = await formEdit.getFieldsValue();
    const body = {
      id: isOpenEditModal?.id,
      room_name: val?.room_name || '',
      room_category_id: val?.room_category_id || '',
      state: val?.state || 0,
    };
    dispatch(modifyRoomAct(body));
  };

  return (
    <>
      <BasicLayout breadcrumb={breadcrumb}>
        <>
          <Spin spinning={roomsReducer?.loading || false}>
            <RestContent
              resetPageNumber={(res: any) => resetPageNumber = res}
              tableLoading={roomsReducer?.isLoading || false}
              dataSource={listRooms?.list || []}
              searchFields={searchFields}
              columns={columns}
              onTableChange={onTableChange}
              onSearch={handleSearch}
              actions={actions}
              keyItem={'id'}
              pagination={{
                current: pageNumber,
                pageSize: itemPerPage,
                total: listRooms?.total || 0,
                showSizeChanger: true,
                pageSizeOptions: PAGE_SIZE_LIST,
              }}
            />
            <Modal title={t('edit_modal')} visible={isOpenEditModal} onCancel={handleCloseModal} onOk={handleEditItem}>
              <Spin spinning={roomsReducer?.loading || false}>
                <Form form={formEdit}>
                  <Form.Item label={t('room_name')} name='room_name' className={'w-100'}
                             rules={[{ required: true, message: t('common:require_field') }]}>
                    <Input placeholder={t('room_name')} className={'w-100'} />
                  </Form.Item>
                  <Form.Item label={t('category')} name='room_category_id' className={'w-100'}
                             rules={[{ required: true, message: t('common:require_field') }]}>
                    <Select placeholder={t('category')}>
                      {roomsReducer?.listRoomCategory?.categories && roomsReducer?.listRoomCategory?.categories.length > 0 ?
                        roomsReducer?.listRoomCategory?.categories.map(category => (
                          <Select.Option key={`category${category?.id}`}
                                         value={category?.id}>{category?.name}</Select.Option>
                        ))
                        : null}
                    </Select>
                  </Form.Item>
                  <Form.Item label={t('common:status')} name='state' className={'w-100'}
                             rules={[{ required: true, message: t('common:require_field') }]}>
                    <Select placeholder={t('common:status')}>
                      <Select.Option value={0}>{t('prepare')}</Select.Option>
                      <Select.Option value={1}>{t('broadcasting')}</Select.Option>
                      <Select.Option value={2}>{t('closed')}</Select.Option>
                    </Select>
                  </Form.Item>
                </Form>
              </Spin>
            </Modal>
          </Spin>
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

export default Room;

