import React, { useEffect, useState } from 'react';
import { Form, Select, Button } from 'antd';
import { Mutation } from 'react-apollo';

import { getCategories } from '@/services/write';
import { ADD_POST } from '@/services/graphql/mutation';

import styles from './styles.less';

const FormItem = Form.Item;
const { Option } = Select;

const DrawerForm = ({ form, markdown }) => {
  const { getFieldDecorator } = form;
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  useEffect(() => {
    getCategories().then(({ data }) => {
      const { categories: fetchCategories } = data;
      setCategories(fetchCategories);
    });
  }, []);
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
        <FormItem label="标签">{getFieldDecorator('tags')(<Select mode="tags" />)}</FormItem>
      </Form>
      <footer className={styles.footer}>
        <Mutation mutation={ADD_POST}>
          {(addPost, { data, loading }) => {
            return (
              <Button
                type="primary"
                onClick={() => {
                  const content = markdown();
                  addPost({ variables: { data: content } });
                }}
              >
                提交
              </Button>
            );
          }}
        </Mutation>
      </footer>
    </div>
  );
};

export default Form.create()(DrawerForm);
