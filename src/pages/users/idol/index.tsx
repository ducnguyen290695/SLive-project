import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Tooltip, Space, Form, notification, Select, Modal } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useRouter } from 'next/router';

import RestContent from '@/src/components/RestContent';
import BasicLayout from '@/src/layouts/BasicLayout';
import styles from './index.module.css';
import Stack from '@/src/components/Stack';
import {
  FORM_LAYOUT,
  INPUT_TYPE,
  DATE_FORMAT,
  FORM_ACTION_TYPE,
  PAGE_SIZE_LIST,
  GENDER,
  DATE_FORMAT_API,
} from '@/src/config/constants';
import FormInput from '@/src/components/FormInput';
import PrivateRoute from '@/src/components/PrivateRoute';
import { disabledDatePicker } from '@/src/utils/sharedUtils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const Idol = () => {
  const { t } = useTranslation(['idol', 'common']);
  const [isStackOpen, setIsStackOpen] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();
  const [actionType, setActionType] = useState('');
  const [idolId, setIdolId] = useState();
  const [isMobile, setIsMobile] = useState(false);
  const [avatarDefaultImage, setAvatarDefaultImage] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
  });

  const { fetching, data, fetchError } = useSelector((state: any) => state.idolReducer?.fetch);
  const { updating, updateSuccess, updateError } = useSelector(
    (state: any) => state?.idolReducer?.update,
  );
  const { deleting, deleteSuccess, deleteError } = useSelector(
    (state: any) => state?.idolReducer?._delete,
  );
  const { changing, changeSuccess, changeError } = useSelector(
    (state: any) => state.idolReducer?.changeStatus,
  );

  const statusOptions = [
    {
      label: t('approved'),
      value: 'approved',
    },
    {
      label: t('rejected'),
      value: 'rejected',
    },
    {
      label: t('none'),
      value: 'none',
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
      title: t('common:name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('birthday'),
      dataIndex: 'birthday',
      key: 'birthday',
    },
    {
      title: t('gender'),
      dataIndex: 'gender',
      key: 'gender_id',
      render: (_, record) => {
        return (
          <span>
            {record.gender_id === 0 ? t(`${GENDER.FEMALE.LABEL}`) : t(`${GENDER.MALE.LABEL}`)}
          </span>
        );
      },
    },
    {
      title: t('phone_number'),
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: t('zalo_phone'),
      dataIndex: 'zalo_phone',
      key: 'zalo_phone',
    },
    {
      title: t('idol_status'),
      dataIndex: 'broadcaster_status',
      key: 'broadcaster_status',
      align: 'center',
      render: (_, record) => {
        if (record.broadcaster_status === 'approved') {
          return <span className={styles.approvedStatus}>{record.broadcaster_status}</span>;
        }
        if (record.broadcaster_status === 'waiting') {
          return <span className={styles.waitingStatus}>{record.broadcaster_status}</span>;
        }
        if (record.broadcaster_status === 'rejected') {
          return <span className={styles.rejectedStatus}>{record.broadcaster_status}</span>;
        }
      },
    },
    {
      title: t('earning'),
      dataIndex: 'earning',
      key: 'earning',
    },
    {
      title: t('change_status'),
      width: 150,
      dataIndex: 'action',
      align: 'center',
      render: (_, record) => {
        let options = [];
        if (record.broadcaster_status === 'waiting') {
          options = statusOptions;
        } else if (record.broadcaster_status === 'approved') {
          options = [statusOptions[1], statusOptions[2]];
        } else {
          options = [statusOptions[0], statusOptions[2]];
        }

        return (
          <Select
            placeholder={t('change_status')}
            className={styles.idolStatusSelect}
            value={record.broadcaster_status}
            options={options}
            onChange={value => {
              openConfirmChangeIdolStatus(value, record);
            }}
          />
        );
      },
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
                openUpdateIdolStack(record);
              }}
              shape="circle"
              icon={<EditOutlined />}
              size={'middle'}
            />
          </Tooltip>
          <Tooltip title={t('common:delete')}>
            <Button
              onClick={() => openConfirmDeleteIdol(record)}
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

  const formFields = [
    {
      type: INPUT_TYPE.IMAGE_UPLOAD,
      formItemOptions: {
        label: t('avatar'),
      },
      inputOptions: {
        listType: 'picture-card',
        showUploadList: false,
        defaultImage: avatarDefaultImage,
        disabled: true,
      },
    },
    {
      formItemOptions: {
        label: t('common:name'),
        name: 'name',
        rules: [{ required: true, message: t('common:require_field') }],
      },
      inputOptions: {
        placeholder: 'Name',
      },
    },
    {
      formItemOptions: {
        label: 'Nick Name',
        name: 'nickname',
        rules: [{ required: true, message: t('common:require_field') }],
      },
      inputOptions: {
        placeholder: 'Nick Name',
      },
    },
    {
      type: INPUT_TYPE.DATE_PICKER,
      formItemOptions: {
        label: t('birthday'),
        name: 'birthday',
        rules: [
          { type: 'object' as const, required: true, message: t('common:please_select_time') },
        ],
      },
      inputOptions: {
        placeholder: t('birthday'),
        format: DATE_FORMAT,
        disabledDate: disabledDatePicker,
      },
    },
    {
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        label: t('gender'),
        name: 'gender_id',
        rules: [{ required: true, message: t('common:require_field') }],
      },
      inputOptions: {
        placeholder: t('gender'),
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
        rules: [
          { required: true, message: t('common:require_field') },
          { type: 'email', message: t('common:email_invalid') },
        ],
      },
      inputOptions: {
        placeholder: 'Email',
      },
    },
    {
      formItemOptions: {
        label: t('earning'),
        name: 'earning',
      },
      inputOptions: {
        placeholder: t('earning'),
        readOnly: true,
      },
    },
  ];

  const onTableChange = pagination => {
    setPagination({
      ...pagination,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  function deleteIdol(id) {
    dispatch({
      type: 'DELETE_IDOL_REQUEST',
      payload: id,
    });
  }

  function updateIdol(values) {
    dispatch({
      type: 'UPDATE_IDOL_REQUEST',
      payload: {
        id: idolId,
        data: {
          ...values,
          birthday: moment(values.birthday).format(DATE_FORMAT_API),
        },
      },
    });
    setIsStackOpen(false);
  }

  function fetchIdol() {
    let { currentPage, pageSize } = pagination;
    let params = {
      skip: (currentPage - 1) * pageSize,
      limit: pageSize,
      'filter[broadcaster_status]': ['approved', 'rejected', 'waiting'],
    };
    dispatch({
      type: 'FETCH_IDOL_REQUEST',
      payload: params,
    });
  }

  function openConfirmDeleteIdol(record) {
    Modal.confirm({
      title: t('common:Confirm'),
      icon: <ExclamationCircleOutlined />,
      content: `${t('confirm_delete_idol')} "${record.name}" ?`,
      onOk() {
        deleteIdol(record.id);
      },
      onCancel() {},
    });
  }

  function openConfirmChangeIdolStatus(value, record) {
    Modal.confirm({
      title: t('common:Confirm'),
      icon: <ExclamationCircleOutlined />,
      content: `${t('confirm_change_idol_status')} "${record.name}" ${t('to')} "${value}" ?`,
      onOk() {
        changeIdolStatus(value, record);
      },
      onCancel() {},
    });
  }

  function changeIdolStatus(value, record) {
    dispatch({
      type: 'CHANGE_IDOL_STATUS_REQUEST',
      payload: {
        id: record.id,
        data: {
          broadcast_status: value,
        },
      },
    });
  }

  function openUpdateIdolStack(record) {
    setActionType(FORM_ACTION_TYPE.UPDATE);
    setIsStackOpen(true);
    setIdolId(record.id);
    setAvatarDefaultImage(record.avatar || '');
    form.setFieldsValue({
      ...record,
      birthday: record?.birthday ? moment(record?.birthday, DATE_FORMAT) : '',
    });
  }

  const createIdol = values => {
    dispatch({
      type: 'CREATE_IDOL_REQUEST',
      payload: {
        ...values,
        birthday: moment(values.birthday).format(DATE_FORMAT),
      },
    });
  };

  useEffect(() => {
    fetchIdol();
  }, [pagination]);

  //On delete idol success
  useEffect(() => {
    if (!deleting && deleteSuccess) {
      notification.success({
        message: t('delete_idol_success'),
      });
      fetchIdol();
    }
  }, [deleting]);

  //On delete idol fail
  useEffect(() => {
    if (!deleting && deleteError) {
      notification.error({
        message: t('delete_idol_failed'),
      });
      fetchIdol();
    }
  }, [deleting]);

  // On fetch idol error
  useEffect(() => {
    if (fetchError?.response?.data.statusCode === 401) {
      notification.error({
        message: fetchError?.response?.data.message,
      });
      router.push('/login');
      dispatch({
        type: 'FETCH_IDOL_CLEANUP',
      });
    }
  }, [fetchError]);

  //On update idol status success
  useEffect(() => {
    if (changeSuccess && !changing) {
      notification.success({
        message: t('change_status_success'),
      });
      fetchIdol();
    }
  }, [changing]);

  //On update idol status fail
  useEffect(() => {
    if (changeError && !changing) {
      notification.error({
        message: t('change_status_failed'),
      });
    }
  }, [changing]);

  //On update idol success
  useEffect(() => {
    if (updateSuccess && !updating) {
      notification.success({
        message: t('update_idol_success'),
      });
      fetchIdol();
    }
  }, [updating]);

  //On update idol fail
  useEffect(() => {
    if (updateError && !updating) {
      dispatch({
        type: 'UPDATE_USER_CLEANUP',
      });
      notification.error({
        message: t('update_idol_failed'),
      });
    }
  }, [updating]);

  useEffect(() => {
    setIsMobile(document.documentElement.clientWidth < 767 ? true : false);
  }, []);

  return (
    <PrivateRoute>
      <BasicLayout loading={changing || updating}>
        <RestContent
          tableLoading={fetching}
          dataSource={
            data?.data?.users?.map((item, index) => {
              return {
                ...item,
                no: index + 1,
                phone: +item.phone,
              };
            }) || []
          }
          columns={columns}
          pagination={{
            pageSize: pagination.pageSize,
            total: data?.data.total || 0,
            showSizeChanger: true,
            pageSizeOptions: PAGE_SIZE_LIST,
            responsive: true,
          }}
          onTableChange={onTableChange}
        />
      </BasicLayout>

      <Stack
        isStackOpen={isStackOpen}
        setIsStackOpen={setIsStackOpen}
        width={isMobile ? '100vw' : '600px'}
        title={actionType === FORM_ACTION_TYPE.CREATE ? t('create_idol') : t('update_idol')}
      >
        <Form
          {...FORM_LAYOUT}
          form={form}
          onFinish={
            actionType === FORM_ACTION_TYPE.CREATE
              ? values => createIdol(values)
              : values => updateIdol(values)
          }
        >
          {formFields.map((field, index) => {
            return <FormInput key={index} {...field} />;
          })}
          <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                {t('common:save')}
              </Button>
              <Button>{t('common:clear')}</Button>
            </Space>
          </Form.Item>
        </Form>
      </Stack>
    </PrivateRoute>
  );
};

export const getServerSideProps = async ({ locale, req }) => ({
  props: {
    ...(await serverSideTranslations(req?.language || locale)),
  },
});

export default Idol;
