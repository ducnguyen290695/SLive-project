import React, { useEffect, useState } from 'react';
import RestContent from '@/src/components/RestContent';
import BasicLayout from '../../layouts/BasicLayout';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Tooltip, Form, notification, Space, Modal } from 'antd';
import { FORM_LAYOUT, INPUT_TYPE, PAGE_SIZE_LIST, FORM_ACTION_TYPE } from '@/src/config/constants';
import FormInput from '@/src/components/FormInput';
import Stack from '@/src/components/Stack';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './index.module.css';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const Gifts = () => {
  const { t } = useTranslation(['gift', 'common']);
  const [isStackOpen, setIsStackOpen] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const [id, setId] = useState(null);
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [files, setFiles] = useState({
    thumbnail: '',
    gif: '',
  });
  const [gifImage, setGifImage] = useState(null);
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
  });

  const { fetching, fetchError, data } = useSelector((state: any) => state?.giftsReducer?.list);
  const { updating, updateSuccess, updateError } = useSelector(
    (state: any) => state?.giftsReducer.update,
  );
  const { creating, createSuccess, createError } = useSelector(
    (state: any) => state?.giftsReducer.create,
  );
  const { deleting, deleteSuccess, deleteError } = useSelector(
    (state: any) => state?.giftsReducer._delete,
  );

  const breadcrumb = [
    {
      name: t('common:home'),
    },
    {
      name: t('common:gift'),
    },
  ];

  const formFields = [
    {
      type: INPUT_TYPE.IMAGE_UPLOAD,
      formItemOptions: {
        label: t('thumbnail'),
        name: 'thumbnail',
        validateStatus: thumbnailImage === null ? 'error' : 'success',
      },
      inputOptions: {
        listType: 'picture-card',
        showUploadList: false,
        getFile: file => {
          setFiles({
            ...files,
            thumbnail: file,
          });
        },
        maxSize: 2,
        imageUrl: thumbnailImage,
        setImageUrl: setThumbnailImage,
        accept: 'image/png, image/jpeg, image/jpg, image/svg+xml, image/pjpeg, image/webp',
        required: { message: t('thumbnail_is_require'), show: showMessage },
      },
    },
    {
      type: INPUT_TYPE.IMAGE_UPLOAD,
      formItemOptions: {
        label: `${t('animation')} (.gif)`,
        name: 'gif',
      },
      inputOptions: {
        listType: 'picture-card',
        showUploadList: false,
        getFile: file =>
          setFiles({
            ...files,
            gif: file,
          }),
        maxSize: 2,
        imageUrl: gifImage,
        setImageUrl: setGifImage,
        accept: 'image/gif',
        required: { message: t('animation_is_required'), show: showMessage },
      },
    },
    {
      formItemOptions: {
        label: t('gift_name'),
        name: 'name',
        rules: [{ required: true, message: t('common:require_field') }],
      },
      inputOptions: {
        placeholder: t('gift_name'),
      },
    },
    {
      type: INPUT_TYPE.NUMBER,
      formItemOptions: {
        label: t('price'),
        name: 'price',
        rules: [
          { required: true, message: t('common:require_field') },
          {
            type: 'number',
            min: 0,
          },
        ],
      },
      inputOptions: {
        placeholder: t('price'),
      },
    },
    {
      type: INPUT_TYPE.NUMBER,
      formItemOptions: {
        label: t('level'),
        name: 'level',
        rules: [
          { required: true, message: t('common:require_field') },
          {
            type: 'number',
            min: 0,
          },
        ],
      },
      inputOptions: {
        placeholder: t('level'),
      },
    },
    {
      type: INPUT_TYPE.NUMBER,
      formItemOptions: {
        label: t('duration'),
        name: 'duration',
        rules: [
          { required: true, message: t('common:require_field') },
          {
            type: 'number',
            min: 0,
          },
        ],
      },
      inputOptions: {
        placeholder: t('duration'),
      },
    },
  ];

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
      title: t('gift_name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: t('animation'),
      dataIndex: 'gif',
      key: 'gif',
      render: (_, record) => {
        return <img src={record.gif} alt="Gif Image" className={styles.gifImage} />;
      },
      align: 'center',
    },
    {
      title: t('level'),
      dataIndex: 'level',
      key: 'level',
      sorter: (a, b) => a.level - b.level,
      align: 'center',
    },
    {
      title: t('common:action'),
      width: 150,
      dataIndex: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title={t('common:modify')}>
            <Button
              type="primary"
              onClick={() => {
                openUpdateGiftStack(record);
              }}
              shape="circle"
              icon={<EditOutlined />}
              size={'middle'}
            />
          </Tooltip>
          <Tooltip title={t('common:delete')}>
            <Button
              onClick={() => {
                openConfirmDeleteGift(record);
              }}
              type="ghost"
              shape="circle"
              icon={<DeleteOutlined />}
              size={'middle'}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const searchFields = [
    {
      formItemOptions: {
        label: t('gift_name'),
        name: 'name',
        rules: [{ required: true, message: t('common:require_field') }],
      },
      inputOptions: {
        placeholder: t('gift_name'),
      },
    },
  ];

  const actions = [
    <Button type="primary" onClick={openCreateGiftStack}>
      {t('create_gift')}
    </Button>,
  ];

  function openConfirmDeleteGift(record) {
    Modal.confirm({
      title: t('common:Confirm'),
      icon: <ExclamationCircleOutlined />,
      content: `${t('confirm_delete_gift')} "${record.name}" ?`,
      onOk() {
        deleteGift(record.id);
      },
      onCancel() {},
    });
  }

  function deleteGift(id) {
    dispatch({
      type: 'DELETE_GIFT_REQUEST',
      payload: id,
    });
  }

  function openCreateGiftStack() {
    setIsStackOpen(true);
    form.resetFields();
    setActionType(FORM_ACTION_TYPE.CREATE);
    setGifImage(null);
    setThumbnailImage(null);
  }

  function openUpdateGiftStack(record) {
    setIsStackOpen(true);
    setId(record.id);
    setActionType(FORM_ACTION_TYPE.UPDATE);
    form.setFieldsValue({
      ...record,
    });
    setGifImage(record.gif);
    setThumbnailImage(record.thumbnail);
  }

  const updateGift = () => {
    const { name, price, level, duration } = form.getFieldsValue();
    form
      .validateFields()
      .then(values => {
        var formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('level', level);
        formData.append('duration', duration);
        files?.thumbnail && formData.append('thumbnail', files?.thumbnail);
        files?.gif && formData.append('gif', files?.gif);
        dispatch({
          type: 'UPDATE_GIFT_REQUEST',
          payload: {
            id,
            data: formData,
          },
        });
        setIsStackOpen(false);
      })
      .catch(err => {
        if (!(files?.thumbnail && files?.gif)) {
          setShowMessage(true);
        }
      });
  };

  const createGift = () => {
    const { name, price, level, duration } = form.getFieldsValue();
    form
      .validateFields()
      .then(values => {
        if (files?.thumbnail && files?.gif) {
          var formData = new FormData();
          formData.append('name', name);
          formData.append('price', price);
          formData.append('level', level);
          formData.append('duration', duration);
          formData.append('thumbnail', files?.thumbnail);
          formData.append('gif', files?.gif);
          dispatch({
            type: 'CREATE_GIFT_REQUEST',
            payload: formData,
          });
          setIsStackOpen(false);
        } else {
          setShowMessage(true);
        }
      })
      .catch(err => {
        if (!(files?.thumbnail && files?.gif)) {
          setShowMessage(true);
        }
      });
  };

  const fetchGifts = () => {
    let { currentPage, pageSize } = pagination;
    let params = {
      skip: (currentPage - 1) * pageSize,
      limit: pageSize,
    };
    dispatch({
      type: 'FETCH_GIFTS_REQUEST',
      payload: params,
    });
  };

  const onTableChange = (pagination, filters, sorter) => {
    setPagination({
      ...pagination,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  // On fetch gift error
  useEffect(() => {
    if (fetchError?.response?.data.statusCode === 401) {
      notification.error({
        message: fetchError?.response?.data.message,
      });
      router.push('/login');
      dispatch({
        type: 'FETCH_GIFT_CLEANUP',
      });
    }
  }, [fetchError]);

  //On Update Success
  useEffect(() => {
    if (updateSuccess && !updating) {
      fetchGifts();
      notification.success({
        message: t('update_gift_success'),
      });
    }
  }, [updating]);

  // On Update Fail
  useEffect(() => {
    if (updateError && !updating) {
      fetchGifts();
      notification.error({
        message: t('update_gift_failed'),
      });
    }
  }, [updating]);

  // On Create Success
  useEffect(() => {
    if (createSuccess && !creating) {
      fetchGifts();
      notification.success({
        message: t('create_gift_success'),
      });

      setFiles(null);
    }
  }, [creating]);

  // On Create Fail
  useEffect(() => {
    if (createError && !creating) {
      fetchGifts();
      notification.error({
        message: t('create_gift_failed'),
      });

      dispatch({
        type: 'CREATE_GIFT_CLEANUP',
      });
    }
  }, [creating]);

  // On Delete Success
  useEffect(() => {
    if (deleteSuccess && !deleting) {
      fetchGifts();
      notification.success({
        message: t('delete_gift_success'),
      });
    }
  }, [deleting]);

  // On Delete Fail
  useEffect(() => {
    if (deleteError && !deleting) {
      fetchGifts();
      notification.error({
        message: t('delete_gift_failed'),
      });

      dispatch({
        type: 'DELETE_GIFT_CLEANUP',
      });
    }
  }, [deleting]);

  useEffect(() => {
    let { currentPage, pageSize } = pagination;
    let params = {
      skip: (currentPage - 1) * pageSize,
      limit: pageSize,
    };
    dispatch({
      type: 'FETCH_GIFTS_REQUEST',
      payload: params,
    });
  }, [pagination]);

  //Reset files and show message on close stack
  useEffect(() => {
    if (isStackOpen) {
      setShowMessage(false);
      setFiles(null);
    }
  }, [isStackOpen]);

  useEffect(() => {
    setIsMobile(document.documentElement.clientWidth < 767 ? true : false);
  }, []);

  return (
    <React.Fragment>
      <BasicLayout breadcrumb={breadcrumb} loading={creating || deleting || updating}>
        <RestContent
          columns={columns}
          dataSource={
            data?.data?.gifts.map((item, index) => {
              return {
                ...item,
                no: index + 1,
              };
            }) || []
          }
          tableLoading={fetching}
          searchFields={searchFields}
          actions={actions}
          onTableChange={onTableChange}
          pagination={{
            pageSize: pagination.pageSize,
            total: data?.data.total || 0,
            showSizeChanger: true,
            pageSizeOptions: PAGE_SIZE_LIST,
            responsive: true,
          }}
        />
      </BasicLayout>

      <Stack
        isStackOpen={isStackOpen}
        setIsStackOpen={setIsStackOpen}
        width={isMobile ? '100vw' : '600px'}
        title={actionType === FORM_ACTION_TYPE.UPDATE ? t('update_gift') : t('create_gift')}
      >
        <Form {...FORM_LAYOUT} form={form}>
          {formFields.map((field, index) => {
            return <FormInput key={index} {...field} />;
          })}
          <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
            <Space>
              <Button
                type="primary"
                onClick={actionType === FORM_ACTION_TYPE.CREATE ? createGift : updateGift}
              >
                {t('common:save')}
              </Button>
              <Button>{t('common:cancel')}</Button>
            </Space>
          </Form.Item>
        </Form>
      </Stack>
    </React.Fragment>
  );
};

export const getServerSideProps = async ({ locale, req }) => ({
  props: {
    ...(await serverSideTranslations(req?.language || locale)),
  },
});

export default Gifts;
