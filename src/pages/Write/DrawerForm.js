import React from 'react';
import { Form, Select, Button } from 'antd';

import { connect } from 'dva';

import PostType from '../PostsList/postType';
import styles from './styles.less';

const FormItem = Form.Item;
const { Option } = Select;

const DrawerForm = ({ form, categories, tags }) => {
  const { getFieldDecorator } = form;
  return (
    <div className={styles.drawerForm}>
      <Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        <FormItem label="状态">
          {getFieldDecorator('status', { initialValue: PostType.published })(
            <Select>
              <Option value={PostType.published}>可见</Option>
              <Option value={PostType.draft}>草稿</Option>
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

export default connect(({ write }) => write)(
  Form.create({
    mapPropsToFields({ current }) {
      if (!current) return null;
      return {
        status: Form.createFormField({
          value: current.type,
        }),
        categories: Form.createFormField({
          value: current.categories,
        }),
        tags: Form.createFormField({
          value: current.tags,
        }),
      };
    },
  })(DrawerForm)
);
