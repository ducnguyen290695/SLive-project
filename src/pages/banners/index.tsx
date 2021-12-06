import React, { useState, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { useDispatch, useSelector } from 'react-redux';
import { notification, Button, Modal, Spin, Form, Input, Image, Tooltip, Space, Tag, Upload } from 'antd';
import type { RootState } from '@/src/redux/store';
import BasicLayout from '@/src/layouts/BasicLayout';
import RestContent from '../../components/RestContent';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { countIndex } from '@/src/utils/common';
import {
  createBannerAct,
  deleteBannerAct,
  getAllBannersAct,
  modifyBannerAct,
  resetAct,
} from '@/src/redux/banners/actions';
import styles from './index.module.css';
import moment from 'moment';
import { PAGE_SIZE_LIST } from '@/src/config/constants';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const Banners = () => {
  const { t } = useTranslation(['banner', 'common']);
  const dispatch = useDispatch();
  const bannersReducer = useSelector((state: RootState) => state.bannersReducer);
  const [pageNumber, setPageNumber] = useImmer<number>(1);
  const [itemPerPage, setItemPerPage] = useImmer<number>(20);
  const [isOpenEditModal, setIsOpenEditModal] = useImmer<any>(false);
  const [loading, setLoading] = useImmer<any>(false);
  const [itemSelected, setItemSelected] = useImmer<any>(null);
  const [imageUrl, setImageUrl] = useImmer<any>(null);
  const [formEdit] = Form.useForm();

  let resetPageNumber;

  useEffect(() => {
    getAllBanners(pageNumber, itemPerPage);
  }, []);

  const getAllBanners = (page?: number, limit?: number, search?) => {
    if (search) {
      Object.keys(search).forEach(key => search[key] === undefined && delete search[key]);
    }
    dispatch(getAllBannersAct({ skip: (page - 1) * limit, limit, search }));
  };

  useEffect(() => {
    if (bannersReducer?.isError) {
      notification.error({
        message: t('common:Error'),
        description: bannersReducer?.error?.response?.data?.message || '',
        duration: 2.5,
      });
      dispatch(resetAct());
    }
  }, [bannersReducer?.isError]);

  useEffect(() => {
    if (bannersReducer?.isSuccess) {
      setIsOpenEditModal(false);
      setItemSelected(null);
      formEdit.resetFields();
      setImageUrl(null);
      resetPageNumber();
      dispatch(resetAct());
    }
  }, [bannersReducer?.isSuccess]);

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
    width: 70,
    render: (text, record) => <div className={'tag-table'} key={`id${record?.id}`}>{record?.id}</div>,
  }, {
    title: t('banner_name'),
    dataIndex: 'name',
    align: 'left',
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (text, record) => <span key={`name${record?.id}`}>{record?.name}</span>,
  }, {
    title: t('image'),
    dataIndex: 'image',
    align: 'center',
    width: 400,
    render: (text, record) => <Image
      width={100}
      src={record?.image}
    />,
  }, {
    title: t('common:created_at'),
    width: 400,
    dataIndex: 'created_at',
    align: 'center',
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (text, record) => <span>{moment(record?.created_at).format('DD/MM/YYYY')}</span>,
  }, {
    title: t('common:action'),
    dataIndex: 'action',
    align: 'center',
    width: 150,
    render: (text, record) =>
      <Space>

        <Tooltip title={t('common:modify')}>
          <Button type='primary' onClick={() => {
            formEdit.setFieldsValue({
              name: record?.name,
              image: {
                file: { url: record?.image, isUpload: true, status: 'done' },
                isListField: [{ url: record?.image, isUpload: true, status: 'done' }],
              },
            });
            setIsOpenEditModal(true);
            setImageUrl({ url: record?.image, isUpload: true });
            setItemSelected(record);
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
      dispatch(deleteBannerAct(id));
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
      name: t('common:banner_management'),
    },
  ];

  const actions = [
    <Button type='primary' onClick={async () => {
      await formEdit.resetFields();
      setImageUrl(null);
      setItemSelected(null);
      setIsOpenEditModal(true);
    }}>
      {t('add_banner')}
    </Button>,
  ];

  const onTableChange = (pagination, filters, sorter, search) => {
    if (pagination.pageSize !== itemPerPage || pagination.current !== pageNumber) {
      setItemPerPage(pagination?.pageSize);
      setPageNumber(pagination?.current);
      getAllBanners(pagination?.current, pagination?.pageSize, search);
    }
  };

  const searchFields = [
    {
      formItemOptions: {
        label: t('banner_name'),
        name: 'name',
      },
      inputOptions: {
        placeholder: t('banner_name'),
      },
    },
  ];

  const handleSearch = (values) => {
    setPageNumber(1);
    getAllBanners(1, itemPerPage, values);
  };

  const handleCloseModal = async () => {
    setIsOpenEditModal(false);
    setItemSelected(null);
    await formEdit.resetFields();
    setImageUrl(null);
  };
  const handleConfirm = async () => {
    await formEdit.validateFields();
    const val = await formEdit.getFieldsValue();
    if (itemSelected) {
      let body;
      if (imageUrl?.isUpload) {
        const formData = new FormData();
        formData.append('name', val?.name || '');
        body = {
          id: itemSelected?.id,
          formData,
        };
        dispatch(modifyBannerAct(body));
      } else {
        const file = val?.image?.file;
        const check = beforeUpload(file);
        if (check) {
          const formData = new FormData();
          formData.append('image', file?.originFileObj);
          formData.append('name', val?.name || '');
          const body = {
            id: itemSelected?.id,
            formData,
          };
          dispatch(modifyBannerAct(body));
        }
      }
    } else {
      const file = val?.image?.file;
      const check = beforeUpload(file);
      if (check) {
        const formData = new FormData();
        formData.append('image', file?.originFileObj);
        formData.append('name', val?.name || '');
        await createBanner(formData);
      }
    }
  };

  const createBanner = async (val) => {
    dispatch(createBannerAct(val));
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      notification.error({ message: t('type_error'), description: t('type_image_invalid'), duration: 2.5 });
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      notification.error({ message: t('size_error'), description: t('image_too_big'), duration: 2.5 });
      return false;
    }

    return isJpgOrPng && isLt5M;
  };

  const handleChange = (e: any) => {
    const { file } = e;
    const url = URL.createObjectURL(file?.originFileObj);
    setImageUrl({ ...file, isUpload: false, status: 'done', url });
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{t('common:upload')}</div>
    </div>
  );

  return (
    <>
      <BasicLayout breadcrumb={breadcrumb}>
        <>
          <Spin spinning={bannersReducer?.loading || false}>
            <RestContent
              resetPageNumber={(res: any) => resetPageNumber = res}
              tableLoading={bannersReducer?.isLoading || false}
              dataSource={bannersReducer?.listBanners?.banners || []}
              searchFields={searchFields}
              columns={columns}
              onTableChange={onTableChange}
              onSearch={handleSearch}
              actions={actions}
              keyItem={'id'}
              pagination={{
                current: pageNumber,
                pageSize: itemPerPage,
                total: bannersReducer?.listBanners?.total || 0,
                showSizeChanger: true,
                pageSizeOptions: PAGE_SIZE_LIST,
              }}
            />
            <Modal title={itemSelected ? t('edit_banner') : t('add_banner')} visible={isOpenEditModal}
                   onCancel={handleCloseModal} onOk={handleConfirm}>
              <Spin spinning={bannersReducer?.loading || loading || false}>
                <Form form={formEdit}>
                  <Form.Item name='name' className={'w-100'}
                             rules={[{ required: true, message: t('common:require_field') }, {
                               whitespace: true,
                               message: t('common:require_field'),
                             }]}>
                    <Input maxLength={200} placeholder={t('banner_name')} className={'w-100'} />
                  </Form.Item>
                  <Form.Item name='image' className={'w-100'}
                             rules={[{ required: true, message: t('common:require_field') }]}>
                    <Upload
                      listType='picture-card'
                      className={'upload-banner'}
                      name='image'
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      accept={'image/*'}
                      multiple={false}
                      customRequest={() => {
                      }}
                    >
                      {imageUrl ? (
                        <img src={imageUrl?.url} alt='avatar' className={styles.imgBanner} />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
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
export default Banners;
