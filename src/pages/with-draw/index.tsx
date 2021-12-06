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
  Tooltip,
  Space,
  Row,
  Col,
  Image,
  Descriptions,
} from 'antd';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  changeStatusAct,
  getAllWithDrawAct,
  resetAct,
} from '@/src/redux/with_draw/actions';
import type { RootState } from '@/src/redux/store';
import BasicLayout from '@/src/layouts/BasicLayout';
import RestContent from '../../components/RestContent';
import { countIndex, deleteNullOrUndefinedInObject } from '@/src/utils/common';
import { GENDER, PAGE_SIZE_LIST } from '@/src/config/constants';
import moment from 'moment';
import styles from './index.module.css';
import { EditOutlined } from '@ant-design/icons';
import api from './../../utils/api';
import { USERS_URL } from '@/src/utils/urlConfig';
import Stack from '@/src/components/Stack';

const WithDraw = () => {
    const { t } = useTranslation(['with_draw', 'common']);
    const dispatch = useDispatch();
    const withDrawReducer = useSelector((state: RootState) => state.withDrawReducer);
    const [pageNumber, setPageNumber] = useImmer<number>(1);
    const [itemPerPage, setItemPerPage] = useImmer<number>(20);
    const [filter, setFilter] = useState({ account_type: null, request_status: null });
    const [searchObject, setSearchObject] = useState({ user_id: '', transactions: '' });
    const [sorter, setSorter] = useState({ updated_at: 'descend' });
    const [form] = Form.useForm();
    const [currentUser, setCurrentUser] = useState(null);
    const [editingKey, setEditingKey] = useState('');
    const [isStackOpen, setIsStackOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const isEditing = (record: any) => record.id === editingKey;
    const edit = (record: Partial<any> & { key: any }) => {
      form.setFieldsValue({ note: '', ...record });
      setEditingKey(record.id);
    };
    const cancel = () => {
      setEditingKey('');
    };

  useEffect(() => {
    setIsMobile(document.documentElement.clientWidth < 767);
  }, []);

    const accountType = [
      {
        value: 'BANK_ACCOUNT',
        text: 'BANK_ACCOUNT',
      }, {
        value: 'CARD_NUMBER',
        text: 'CARD_NUMBER',
      },
    ];

    const statusList = [
      {
        value: 'waiting',
        text: t('waiting'),
      }, {
        value: 'approved',
        text: t('approved'),
      }, {
        value: 'rejected',
        text: t('rejected'),
      }, {
        value: 'success',
        text: t('success'),
      }, {
        value: 'failed',
        text: t('failed'),
      }, {
        value: 'retry',
        text: t('retry'),
      },
    ];


    let resetPageNumber;

    useEffect(() => {
      getAllWithDraw(pageNumber, itemPerPage, {}, {});
    }, []);

    const getAllWithDraw = (page: number, limit: number, filters: any, sort: any, search?: any) => {
      const body: any = {
        skip: (page - 1) * limit,
        limit,
      };
      if (filters && Object.keys(filters || {}).length > 0) {
        const filterObj = deleteNullOrUndefinedInObject(filters || {});
        body.filter = filterObj || {};
      }
      if (sort && sort?.order && Object.keys(sort || {}).length > 0) {
        body.sort = sort?.order === 'descend' ? `-${sort.field}` : sort.field;
      } else {
        body.sort = '-updated_at';
      }
      if (search && Object.keys(search || {}).length > 0) {
        const newSearch = deleteNullOrUndefinedInObject(search);
        if (search && Object.keys(search || {}).length > 0) {
          body.search = newSearch;
        }
      }
      dispatch(getAllWithDrawAct(body));
    };

    useEffect(() => {
      if (withDrawReducer?.isError) {
        notification.error({
          message: t('common:Error'),
          description: withDrawReducer?.error?.data?.message || '',
          duration: 2.5,
        });
        dispatch(resetAct());
      }
    }, [withDrawReducer?.isError]);

    useEffect(() => {
      if (withDrawReducer?.isSuccess) {
        dispatch(resetAct());
        getAllWithDraw(pageNumber, itemPerPage, {}, {});
      }
    }, [withDrawReducer?.isSuccess]);

    const handleUpdateStatus = (newStatus, requestId) => {
      const body = [{
        'withdraw_request_id': requestId,
        'request_status': newStatus,
      }];
      dispatch(changeStatusAct(body));
    };


    const _renderStatus = status => {
      switch (status) {
        case 'waiting':
          return <span className={`tag-table ${styles.tagDiv} ${styles.orange}`}>{t('waiting')}</span>;
        case 'approved':
          return <span className={`tag-table ${styles.tagDiv} ${styles.approved}`}>{t('approved')}</span>;
        case 'success':
          return <span className={`tag-table ${styles.tagDiv} ${styles.green}`}>{t('success')}</span>;
        case 'rejected':
          return <span className={`tag-table ${styles.tagDiv} ${styles.rejected}`}>{t('rejected')}</span>;
        case 'failed':
          return <span className={`tag-table ${styles.tagDiv} ${styles.red}`}>{t('failed')}</span>;
        case 'retry':
          return <span className={`tag-table ${styles.tagDiv} ${styles.gray}`}>{t('retry')}</span>;
        default:
          return '';
      }
    };

    const handleViewUserDetail = async (user_id: string) => {
      try {
        const response = await api.get({ url: `${USERS_URL}/${user_id}` });
        if (response?.data?.data) {
          setCurrentUser(response?.data?.data);
          setIsStackOpen(true);
        }
      } catch (e) {
        setCurrentUser(null);
      }

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
      title: t('transactions'),
      align: 'center',
      width: 200,
      dataIndex: 'transactions',
      sorter: (a, b) => a.transactions.localeCompare(b.transactions),
      render: (text, record) => <span key={`transactions${record?.id}`}>{record?.transactions}</span>,
    }, {
      title: t('common:name'),
      align: 'center',
      width: 250,
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => <div onClick={() => handleViewUserDetail(record?.user_id)}
                                     key={`user_id${record?.user_id}`}
                                     className={styles.link}>{record?.name || ''}</div>,
    }, {
      title: t('account'),
      dataIndex: 'account',
      align: 'center',
      width: 250,
      sorter: (a, b) => a.account.localeCompare(b.account),
      render: (text, record) => <span
        key={`account${record?.id}`}>{record?.account || ''}</span>,
    }, {
      title: t('account_type'),
      dataIndex: 'account_type',
      align: 'center',
      width: 200,
      filters: accountType,
      filteredValue: filter?.account_type || null,
      sorter: (a, b) => a.account_type.localeCompare(b.account_type),
      render: (text, record) => <span
        key={`account_type${record?.id}`}>{record?.account_type || ''}</span>,
    }, {
      title: t('bank'),
      dataIndex: 'bank',
      align: 'center',
      width: 200,
      sorter: (a, b) => a.bank.localeCompare(b.bank),
      render: (text, record) => <span
        key={`bank${record?.id}`}>{record?.bank || ''}</span>,
    }, {
      title: t('amount'),
      dataIndex: 'amount',
      align: 'center',
      width: 250,
      sorter: (a, b) => a.amount - b.amount,
      render: (text, record) => <span
        key={`amount${record?.id}`}>{record?.amount || ''}</span>,
    }, {
      title: t('common:status'),
      dataIndex: 'request_status',
      align: 'center',
      width: 200,
      filters: statusList,
      filteredValue: filter?.request_status || null,
      sorter: (a, b) => a.request_status.localeCompare(b.request_status),
      render: (text, record) => _renderStatus(record?.request_status || ''),
    }, {
      title: t('note'),
      dataIndex: 'note',
      width: 250,
      editable: true,
      align: 'center',
      render: (text, record) => <div style={{ display: 'flex', justifyContent: 'space-between' }}><span
        key={`note${record?.id}`}>{record?.note || ''}</span><EditOutlined disabled={editingKey !== ''}
                                                                           onClick={() => edit(record)} style={{
        fontSize: '13px',
        cursor: 'pointer',
      }} /></div>,
    }, {
      title: t('common:updated_at'),
      dataIndex: 'updated_at',
      width: 200,
      align: 'center',
      defaultSortOrder: sorter['updated_at'],
      sorter: (a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix(),
      render: (text, record) => <span>{moment(record?.updated_at).format('DD/MM/YYYY HH:mm:ss')}</span>,
    }, {
      title: t('common:action'),
      dataIndex: 'action',
      width: 200,
      align: 'center',
      render: (_, record) => {
        const editable = isEditing(record);

        return editable ? (
          <Space>
            <Button
              type='primary'
              onClick={cancel}
            >{t('common:modify')}</Button>
            <Button
              type='primary'
              onClick={cancel}
            >{t('common:cancel')}</Button>
          </Space>
        ) : (
          <Space>
            <> {record?.request_status === 'waiting' && (
              <>
                <Button
                  type='primary'
                  onClick={() => handleUpdateStatus('approved', record?.id)}
                >{t('approved')}</Button>
                <Button
                  type='primary'
                  onClick={() => handleUpdateStatus('rejected', record?.id)}
                >{t('rejected')}</Button>
              </>
            )}
              {record?.request_status === 'failed' && (
                <>
                  <Button
                    type='primary'
                    onClick={() => handleUpdateStatus('approved', record?.id)}
                  >{t('retry')}</Button>
                </>
              )}
            </>

          </Space>
        );
      },
    },
    ];
    const breadcrumb = [
      {
        name: t('common:home'),
      },
      {
        name: t('common:withdraw_management'),
      },
    ];

    const actions = [];

    const onTableChange = (pagination, filters, sorter, search) => {
      setItemPerPage(pagination?.pageSize);
      setPageNumber(pagination?.current);
      getAllWithDraw(pagination?.current, pagination?.pageSize, filters, sorter);
      setFilter(filters);
    };

    const mergedColumns = columns.map((col: any) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: any) => ({
          record,
          inputType: 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    });

    let timmer = null;
    const handleChangeText = (e) => {
      clearTimeout(timmer);
      timmer = setTimeout(() => {
        setPageNumber(1);
        getAllWithDraw(1, itemPerPage, filter, sorter, { ...searchObject, [e.target.name]: e.target.value });
        setSearchObject((state) => ({
          ...state,
          [e.target.name]: e.target.value,
        }));

      }, 200);
    };

    return (
      <>
        <BasicLayout breadcrumb={breadcrumb}>
          <>
            <Spin spinning={withDrawReducer?.loading || false}>

              <Row className={styles.rowSearch} gutter={[24, 24]} justify={'start'}>
                <Col xxl={6} xl={10} lg={18} md={24} sm={24} xs={24} style={{ flexDirection: 'row' }}>
                  <span>{t('user_id')}:</span>{' '}
                  <Input onChange={handleChangeText} name={'user_id'} allowClear={true}
                         placeholder={t('user_id')} className={'w-70'} />
                </Col>
                <Col xxl={6} xl={10} lg={18} md={24} sm={24} xs={24} style={{ flexDirection: 'row' }}>
                  <span>{t('transaction_id')}:</span>{' '}
                  <Input onChange={handleChangeText} name={'transactions'} allowClear={true}
                         placeholder={t('transaction_id')} className={'w-70'} />
                </Col>
              </Row>
              <Form form={form} component={false}>
                <RestContent
                  resetPageNumber={(res: any) => resetPageNumber = res}
                  tableLoading={withDrawReducer?.isLoading || false}
                  dataSource={withDrawReducer?.listWithDraw?.requests || []}
                  searchFields={[]}
                  columns={mergedColumns}
                  onTableChange={onTableChange}
                  onSearch={() => {
                  }}
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                  actions={actions}
                  rowClassName='editable-row'
                  keyItem={'id'}
                  pagination={{
                    current: pageNumber,
                    pageSize: itemPerPage,
                    total: withDrawReducer?.listWithDraw?.total || 0,
                    showSizeChanger: true,
                    pageSizeOptions: PAGE_SIZE_LIST,
                  }}
                />
              </Form>
              <Stack
                isStackOpen={isStackOpen}
                setIsStackOpen={setIsStackOpen}
                width={isMobile ? '100vw' : '600px'}
                title={t('user_detail')}
              >
                <div className={styles.detailContainer}>
                  {currentUser?.avatar && (<Image
                    width={150}
                    className={styles.avatar}
                    src={currentUser?.avatar}
                  />)}
                  <Descriptions title='' column={1}>
                    <Descriptions.Item label='ID'>{currentUser?.id}</Descriptions.Item>
                    <Descriptions.Item label={t('common:name')}>{currentUser?.name}</Descriptions.Item>
                    <Descriptions.Item label='Nickname'>{currentUser?.nickname}</Descriptions.Item>
                    <Descriptions.Item
                      label={t('gender')}>{currentUser?.gender_id === 0 ? t(`${GENDER.FEMALE.LABEL}`) : t(`${GENDER.MALE.LABEL}`)}</Descriptions.Item>
                    <Descriptions.Item label={t('phone_number')}>{currentUser?.phone}</Descriptions.Item>
                    <Descriptions.Item label='Email'>{currentUser?.email}</Descriptions.Item>
                    <Descriptions.Item label={t('birthday')}>{currentUser?.birthday}</Descriptions.Item>
                  </Descriptions>
                </div>
              </Stack>
            </Spin>
          </>
        </BasicLayout>
      </>
    );
  }
;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: any;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
                                                     editing,
                                                     dataIndex,
                                                     title,
                                                     inputType,
                                                     record,
                                                     index,
                                                     children,
                                                     ...restProps
                                                   }) => {
  const inputNode = <Input />;
  const { t } = useTranslation(['common']);
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: t('common:require_field'),
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export const getServerSideProps = async ({ locale, req }) => ({
  props: {
    ...(await serverSideTranslations(req?.language || locale)),
  },
});

export default WithDraw;
;

