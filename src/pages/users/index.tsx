import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Tooltip, Space, Form, notification, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Stack from '@/src/components/Stack';
import { disabledDatePicker, buildQueryString } from '@/src/utils/sharedUtils';
import FormInput from '@/src/components/FormInput';
import moment from 'moment';
import RestContent from '../../components/RestContent';
import BasicLayout from '../../layouts/BasicLayout';
import {
  FORM_LAYOUT,
  DATE_FORMAT,
  DATE_FORMAT_API,
  INPUT_TYPE,
  PAGE_SIZE_LIST,
  GENDER,
} from '@/src/config/constants';
import styles from './index.module.css';
import queryString from 'query-string';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function Users() {
  const { t } = useTranslation(['user', 'common']);
  const [isStackOpen, setIsStackOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 0,
  });
  const [currentUserId, setCurentUserId] = useState('');

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const router = useRouter();

  const { fetching, data, fetchError } = useSelector((state: any) => state?.userReducer?.fetch);
  const { deleting, deleteSuccess, deleteError } = useSelector(
    (state: any) => state?.userReducer?._delete,
  );
  const { updating, updateSuccess, updateError } = useSelector(
    (state: any) => state?.userReducer?.update,
  );

  const breadcrumb = [
    {
      name: t('common:home'),
    },
    {
      name: t('common:users_management'),
    },
  ];

  const searchFields = [
    {
      formItemOptions: {
        label: t('common:name'),
        name: 'name',
      },
      inputOptions: {
        placeholder: t('common:name'),
      },
    },
  ];

  const formFields = [
    {
      formItemOptions: {
        label: t('common:name'),
        name: 'name',
        rules: [{ required: true, message: t('common:require_field') }],
      },
      inputOptions: {
        placeholder: t('common:name'),
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
        label: t('address'),
        name: 'address',
      },
      inputOptions: {
        placeholder: t('address'),
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
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('address'),
      dataIndex: 'address',
      key: 'address',
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
                openUpdateStack(record);
              }}
              shape="circle"
              icon={<EditOutlined />}
              size={'middle'}
            />
          </Tooltip>
          <Tooltip title={t('common:delete')}>
            <Button
              onClick={() => {
                openConfirmDeleteUser(record);
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

  function openUpdateStack(record) {
    let { name, address, birthday, email, gender_id } = record;
    setIsStackOpen(true);
    setCurentUserId(record.id);
    form.setFieldsValue({
      name,
      address,
      birthday: birthday ? moment(birthday, DATE_FORMAT) : '',
      email,
      gender_id: gender_id === 0 ? GENDER.FEMALE.VALUE : GENDER.MALE.VALUE,
    });
  }

  function deleteUser(id) {
    dispatch({
      type: 'DELETE_USER_REQUEST',
      payload: id,
    });
  }

  function openConfirmDeleteUser(record) {
    Modal.confirm({
      title: t('common:Confirm'),
      icon: <ExclamationCircleOutlined />,
      content: `${t('confirm_delete_user')} "${record.name}" ?`,
      onOk() {
        deleteUser(record.id);
      },
      onCancel() {},
    });
  }

  const updateUser = values => {
    const payload = {
      ...values,
      birthday: moment(values.birthday).format(DATE_FORMAT_API),
    };
    dispatch({
      type: 'UPDATE_USER_REQUEST',
      payload: {
        id: currentUserId,
        payload: payload,
      },
    });
    setIsStackOpen(false);
  };

  const resetForm = () => {
    form.resetFields();
  };

  const onTableChange = pagination => {
    let params = {
      skip: (pagination.current - 1) * pagination.pageSize,
      limit: pagination.pageSize,
    };

    dispatch({
      type: 'FETCH_USERS_REQUEST',
      payload: params,
    });

    setPagination({
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    });

    buildQueryString({
      rootUrl: 'users',
      params: params,
    });
  };

  const onSearch = values => {
    if (values.name) {
      dispatch({
        type: 'FETCH_USERS_REQUEST',
        payload: {
          'search[name]': values.name,
        },
      });

      buildQueryString({
        rootUrl: 'users',
        params: {
          'search[name]': values.name,
        },
      });
    } else {
      dispatch({
        type: 'FETCH_USERS_REQUEST',
        payload: {},
      });

      let params = {
        skip: (pagination.currentPage - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      };

      buildQueryString({
        rootUrl: 'users',
        params,
      });
    }
  };

  const getParams = () => {
    const query = queryString.parse(location.search);
    const skip = parseInt((query as any)?.skip) ? parseInt((query as any)?.skip) : 0;
    const limit = parseInt((query as any)?.limit) ? parseInt((query as any)?.limit) : 20;
    const name = (query as any)['search[name]'] ? (query as any)['search[name]'] : '';
    let params = {
      skip,
      limit,
      'search[name]': name,
    };

    return {
      skip,
      limit,
      name,
      params,
    };
  };

  const fetchUser = () => {
    const { params } = getParams();
    if (fetchError?.response?.data?.statusCode === 401) {
      router.push('./login');
    }
    dispatch({
      type: 'FETCH_USERS_REQUEST',
      payload: params,
    });
  };

  //On Refresh page
  useEffect(() => {
    const { skip, limit } = getParams();
    setPagination({
      currentPage: skip / limit + 1,
      pageSize: limit,
    });
    fetchUser();
  }, []);

  // On fetch user error
  useEffect(() => {
    if (fetchError?.response?.data.statusCode === 401) {
      notification.error({
        message: fetchError?.response?.data.message,
      });
      router.push('/login');
      dispatch({
        type: 'FETCH_USERS_CLEANUP',
      });
    }
  }, [fetchError]);

  //On delete user success
  useEffect(() => {
    if (!deleting && deleteSuccess) {
      notification.success({
        message: t('delete_user_success'),
      });
      fetchUser();
    }
  }, [deleting]);

  //On delete user fail
  useEffect(() => {
    if (!deleting && deleteError) {
      notification.error({
        message: t('delete_user_failed'),
      });
      fetchUser();
    }
  }, [deleting]);

  useEffect(() => {
    setIsMobile(document.documentElement.clientWidth < 767 ? true : false);
  }, []);

  //On update user success
  useEffect(() => {
    if (updateSuccess && !updating) {
      notification.success({
        message: t('update_user_success'),
      });
      fetchUser();
    }
  }, [updating]);

  //On update user fail
  useEffect(() => {
    if (updateError && !updating) {
      dispatch({
        type: 'UPDATE_USER_CLEANUP',
      });
      notification.error({
        message: t('update_user_failed'),
      });
    }
  }, [updating]);

  return (
    <React.Fragment>
      <BasicLayout breadcrumb={breadcrumb} loading={deleting || updating}>
        <RestContent
          tableLoading={fetching}
          dataSource={data?.users?.map((item, index) => {
            return {
              ...item,
              no: (pagination.currentPage - 1) * 20 + index + 1,
            };
          })}
          searchFields={searchFields}
          columns={columns}
          onTableChange={onTableChange}
          onSearch={values => onSearch(values)}
          pagination={{
            pageSize: pagination.pageSize,
            total: data?.total || 0,
            showSizeChanger: true,
            pageSizeOptions: PAGE_SIZE_LIST,
            current: pagination.currentPage,
          }}
        />
      </BasicLayout>

      <Stack
        isStackOpen={isStackOpen}
        setIsStackOpen={setIsStackOpen}
        width={isMobile ? '100vw' : '600px'}
        title={t('update_user')}
      >
        <Form
          {...FORM_LAYOUT}
          form={form}
          onFinish={values => {
            updateUser(values);
          }}
        >
          {formFields.map((field, index) => {
            return <FormInput key={index} {...field} />;
          })}

          <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                {t('common:save')}
              </Button>

              <Button onClick={resetForm}>{t('common:clear')}</Button>
            </Space>
          </Form.Item>
        </Form>
      </Stack>
    </React.Fragment>
  );
}

export const getServerSideProps = async ({ locale, req }) => ({
  props: {
    ...(await serverSideTranslations(req?.language || locale)),
  },
});
