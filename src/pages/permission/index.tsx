import React, { useEffect, useState } from 'react';
import RestContent from '@/src/components/RestContent';
import BasicLayout from '../../layouts/BasicLayout';
import { useDispatch, useSelector } from 'react-redux';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { generateActions } from '@/src/utils/redux/generator';
import { RootState } from '@/src/redux/store';
import { Button, Tooltip, Form, notification, Space, Modal, Popover, Select } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { FORM_LAYOUT, INPUT_TYPE, PAGE_SIZE_LIST } from '@/src/config/constants';
import FormInput from '@/src/components/FormInput';
import Stack from '@/src/components/Stack';
import UserInfo from './components/UserInfo';

const Permission = () => {
  const [isStackOpen, setIsStackOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [params, setParams] = useState({
    currentPage: 1,
    pageSize: 20,
    sort: '',
    'filter[user_id]': null,
  });

  const { t } = useTranslation(['role', 'common']);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [userIdSearchForm] = Form.useForm();

  const [FETCH, CREATE, , DELETE] = generateActions('role');

  const { data, fetching } = useSelector((state: RootState) => state?.roleReducer?.fetch);
  const { creating, createSuccess, createError } = useSelector(
    (state: RootState) => state?.roleReducer?.create,
  );
  const { deleting, deleteSuccess, deleteError } = useSelector(
    (state: RootState) => state?.roleReducer?.deleteRole,
  );
  const userReducer = useSelector((state: any) => state?.userReducer);

  const actions = [
    <Button type="primary" onClick={openCreateRoleStack}>
      {t('create_role')}
    </Button>,
  ];

  const userOptions = (userReducer?.fetch?.data?.users || []).map(item => {
    const { name, email, phone, id } = item;
    return (
      <Select.Option value={id}>
        <Popover
          placement="left"
          content={UserInfo({
            name,
            email,
            phone,
          })}
          style={{ marginRight: '10px' }}
        >
          <div>
            {name} ( ID: {id} )
          </div>
        </Popover>
      </Select.Option>
    );
  });

  const roles = [
    {
      label: 'User',
      value: 'user',
    },
    {
      label: 'Host',
      value: 'host',
    },
    {
      label: 'Manager',
      value: 'manager',
    },
    {
      label: 'Admin',
      value: 'admin',
    },
  ];

  const formFields = [
    {
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        label: t('user_name'),
        name: 'user_id',
        rules: [{ required: true, message: t('common:require_field') }],
      },
      inputOptions: {
        placeholder: t('user_name'),
        children: userOptions,
        showSearch: true,
      },
    },
    {
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        label: t('role'),
        name: 'role',
        rules: [{ required: true, message: t('common:require_field') }],
      },
      inputOptions: {
        placeholder: t('role'),
        options: roles,
      },
    },
  ];

  const breadcrumb = [
    {
      name: t('common:home'),
    },
    {
      name: t('common:permission'),
    },
  ];

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: () => (
      <div style={{ padding: 8 }}>
        <Form form={userIdSearchForm} onFinish={values => handleSearchUserId(values)}>
          <FormInput
            type={INPUT_TYPE.NUMBER}
            formItemOptions={{
              name: 'user_id',
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
            <Button type="primary" size="small" style={{ minWidth: 60 }} htmlType={'submit'}>
              {t('common:search')}
            </Button>
            <Button size="small" style={{ minWidth: 60 }} onClick={onResetSearchUserId}>
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
      title: t('user_id'),
      dataIndex: 'user_id',
      key: 'user_id',
      sorter: (a, b) => a.user_id - b.user_id,
      align: 'center',
      ...getColumnSearchProps('user_id'),
    },
    {
      title: t('user_name'),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        let user: any = getUserById(record.user_id);
        return user.name;
      },
    },
    {
      title: t('user_email'),
      dataIndex: 'email',
      key: 'email',
      render: (_, record) => {
        let user: any = getUserById(record.user_id);
        return user.email;
      },
    },
    {
      title: t('role'),
      dataIndex: 'role',
      key: 'price',
      render: (_, record) => getRoleLabelByValue(record.role),
    },
    {
      title: t('common:action'),
      width: 70,
      dataIndex: 'action',
      align: 'center',
      render: (_, record) => (
        <Tooltip title={t('common:delete')}>
          <Button
            onClick={() => {
              openConfirmDeleteRole(record);
            }}
            type="ghost"
            shape="circle"
            icon={<DeleteOutlined />}
            size={'middle'}
          />
        </Tooltip>
      ),
    },
  ];

  function handleSearchUserId(values) {
    console.log({ values });
    setParams({
      ...params,
      'filter[user_id]': values.user_id,
    });
  }

  function onResetSearchUserId() {
    userIdSearchForm.resetFields();
    setParams({
      ...params,
      'filter[user_id]': null,
    });
  }

  function getRoleLabelByValue(value) {
    if (value === 'admin') {
      return 'Admin';
    }
    if (value === 'manager') {
      return 'Manager';
    }
    if (value === 'super_admin') {
      return 'Super Admin';
    }
    if (value === 'user') {
      return 'User';
    }
    if (value === 'host') {
      return 'Host';
    }
    return '';
  }

  function openCreateRoleStack() {
    setIsStackOpen(true);
    form.resetFields();
  }

  const fetchRole = () => {
    const { currentPage, pageSize, sort } = params;
    let requestParams = {
      skip: (currentPage - 1) * pageSize,
      limit: pageSize,
      sort,
      'filter[user_id]': params['filter[user_id]'],
    };
    dispatch({
      type: FETCH.FETCH_REQUEST,
      payload: requestParams,
    });
  };

  function fetchUsers() {
    dispatch({
      type: 'FETCH_USERS_REQUEST',
    });
  }

  function getUserById(id) {
    let result = {};
    if (userReducer?.fetch?.data?.users.length) {
      for (let user of userReducer?.fetch?.data?.users) {
        if (user.id === id) {
          result = user;
          break;
        }
      }
    }
    return result;
  }

  const onTableChange = (pagination, filters, sorter) => {
    setParams({
      ...pagination,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      sort: sorter.order
        ? sorter.order === 'descend'
          ? `-${sorter.field}`
          : `${sorter.field}`
        : '',
    });
  };

  function openConfirmDeleteRole(record) {
    Modal.confirm({
      title: t('common:Confirm'),
      icon: <ExclamationCircleOutlined />,
      content: `${t('delete_role_confirm')} "${record.role}" ?`,
      onOk() {
        removeRole(record);
      },
      onCancel() {},
    });
  }

  function removeRole(record) {
    dispatch({
      type: DELETE.DELETE_REQUEST,
      payload: [
        {
          user_id: record.user_id,
          role: record.role,
        },
      ],
    });
  }

  function createRole(values) {
    const { user_id, role } = values;
    dispatch({
      type: CREATE.CREATE_REQUEST,
      payload: { user_id, role },
    });
  }

  //On create role success
  useEffect(() => {
    if (!creating && createSuccess) {
      notification.success({
        message: t('create_role_success'),
      });
      setIsStackOpen(false);
      fetchRole();
    }
  }, [creating]);

  //On create role fail
  useEffect(() => {
    if (!creating && createError) {
      notification.error({
        message: t('create_role_fail'),
      });
      dispatch({
        type: CREATE.CREATE_CLEANUP,
      });
    }
  }, [creating]);

  //On delete role success
  useEffect(() => {
    if (!deleting && deleteSuccess) {
      notification.success({
        message: t('delete_role_success'),
      });
      fetchRole();
    }
  }, [deleting]);

  //On delete role fail
  useEffect(() => {
    if (!deleting && deleteError) {
      notification.error({
        message: t('delete_role_fail'),
      });
      dispatch({
        type: DELETE.DELETE_CLEANUP,
      });
    }
  }, [deleting]);

  useEffect(() => {
    fetchRole();
  }, [params]);

  useEffect(() => {
    setIsMobile(document.documentElement.clientWidth < 767 ? true : false);
    fetchUsers();
    return () => {
      dispatch({
        type: CREATE.CREATE_CLEANUP,
      });
      dispatch({
        type: DELETE.DELETE_CLEANUP,
      });
    };
  }, []);

  return (
    <React.Fragment>
      <BasicLayout breadcrumb={breadcrumb}>
        <RestContent
          columns={columns}
          actions={actions}
          dataSource={
            data?.data?.result.map((item, index) => {
              return {
                ...item,
                no: index + 1,
              };
            }) || []
          }
          tableLoading={fetching || !!deleting}
          onTableChange={onTableChange}
          pagination={{
            pageSize: params.pageSize,
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
        title={t('create_role')}
      >
        <Form {...FORM_LAYOUT} form={form} onFinish={values => createRole(values)}>
          {formFields.map((field, index) => {
            return (
              <FormInput key={index} {...field} inputChildren={index === 0 ? userOptions : null} />
            );
          })}
          <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                {t('common:save')}
              </Button>
              <Button onClick={() => setIsStackOpen(false)}>{t('common:cancel')}</Button>
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

export default Permission;
