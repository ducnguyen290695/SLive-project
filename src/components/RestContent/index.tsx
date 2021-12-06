import React, { useEffect, useRef } from 'react';
import { Table, Form, Space, Button, Divider, Row, Col } from 'antd';
import FormInput from '../FormInput';
import { SEARCH_FORM_LAYOUT } from '@/src/config/constants';
import styles from './index.module.css';
import { useTranslation, withTranslation } from 'next-i18next';

const RestContent = props => {
  const {
    dataSource,
    columns,
    onTableChange,
    searchFields,
    onSearch,
    actions,
    tableLoading,
    keyItem,
    pagination,
    disabledSearchButton,
    components
  } = props;
  const [form] = Form.useForm();
  const { t } = useTranslation(['common']);

  const resetSearchForm = async () => {
    await form.resetFields();
    const formVal = await form.getFieldsValue();
    onSearch(formVal);
  };

  const _onTableChange = async (pagination, filters, sorter) => {
    const formVal = await form.getFieldsValue();
    const search = formVal;
    onTableChange(pagination, filters, sorter, search);
  };

  const resetPageNumber = async () => {
    const formVal = await form.getFieldsValue();
    onSearch(formVal);
  };

  useEffect(() => {
    if (props.resetPageNumber && props.resetPageNumber !== null) {
      props.resetPageNumber(resetPageNumber);
    }
  });

  return (
    <div>
      {searchFields && searchFields.length > 0 && (
        <div className={styles.searchSection}>
          <Form {...SEARCH_FORM_LAYOUT} form={form} onFinish={values => onSearch(values)}>
            <div className={styles.row}>
              {searchFields.map((field, index) => {
                return (
                  <div className={styles.column}>
                    <FormInput key={index} {...field} />
                  </div>
                );
              })}

              <Form.Item>
                <div className={styles.column}>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={disabledSearchButton}
                    >
                      {t('common:search')}
                    </Button>

                    <Button onClick={resetSearchForm}>
                      {t('common:clear')}
                    </Button>
                  </Space>
                </div>
              </Form.Item>
            </div>
          </Form>
        </div>
      )}

      {actions && (
        <React.Fragment>
          <Space style={{ marginBottom: '15px' }}>
            {actions.map((action, index) => {
              return <React.Fragment key={index}>{action}</React.Fragment>;
            })}
          </Space>
        </React.Fragment>
      )}

      <Table
        rowKey={'id'}
        loading={tableLoading}
        dataSource={dataSource}
        columns={columns}
        bordered
        components={components}
        pagination={pagination}
        onChange={_onTableChange}
        size={'small'}
      />
    </div>
  );
};

export default withTranslation()(RestContent);
