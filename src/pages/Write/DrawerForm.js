import React, { useEffect, useState } from 'react';
import { Form, Select, Button, message } from 'antd';

import { connect } from 'dva';

import PostType from '../PostsList/postType';
import styles from './styles.less';

const FormItem = Form.Item;
const { Option } = Select;

const DrawerForm = ({ form, categories, tags, onCommit, current, dispatch }) => {
  const [loading, setLoading] = useState(false);
  const { getFieldDecorator } = form;
  const onSubmit = async () => {
    setLoading(true);
    const values = form.getFieldsValue();
    const { _id } = current || {};
    const data = await onCommit(values, _id);
    setLoading(false);
    if (!data) message.error('操作失败');
    else {
      const {
        data: {
          post: { _id: id },
        },
      } = data;
      await dispatch({
        type: 'postsList/findPostByID',
        id,
      });
      message.success('操作成功');
    }
  };
  useEffect(
    () => {
      // form的mapPropsToFields会导致表单数据丢失，只能用useEffect手动设置
      if (!current) return;
      const { categories: currentCategories, tags: currentTags, type } = current;
      form.setFieldsValue({
        type,
        tags: currentTags,
        categories: currentCategories,
      });
    },
    [current]
  );
  return (
    <div className={styles.drawerForm}>
      <Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        <FormItem label="状态">
          {getFieldDecorator('type', { initialValue: PostType.published })(
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
        <Button loading={loading} type="primary" onClick={onSubmit}>
          提交
        </Button>
      </footer>
    </div>
  );
};

export default connect(({ write }) => write)(Form.create()(DrawerForm));
