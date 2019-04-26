import React, { useEffect, useState } from 'react';
import { Form, Select, Button } from 'antd';

import { getCategories, getTags } from '@/services/write';

import styles from './styles.less';

const FormItem = Form.Item;
const { Option } = Select;

const DrawerForm = ({ form, categories, tags }) => {
  const { getFieldDecorator } = form;
  return (
    <div className={styles.drawerForm}>
      <Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        <FormItem label="状态">
          {getFieldDecorator('status', { initialValue: 1 })(
            <Select>
              <Option value={0}>草稿</Option>
              <Option value={1}>可见</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="分类">
          {getFieldDecorator('categories')(
            <Select mode="tags">
              {categories.map(({ name }) => (
                <Option key={name}>{name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="标签">
          {getFieldDecorator('tags')(
            <Select mode="tags">
              {tags.map(({ name }) => (
                <Option key={name}>{name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
      </Form>
      <footer className={styles.footer}>
        <Button type="primary">提交</Button>
      </footer>
    </div>
  );
};

export default Form.create()(DrawerForm);
