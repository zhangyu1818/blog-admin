import React, { useState, useRef } from 'react';
import { Tabs, Card, PageHeader, Spin, Modal, Form, Input, Radio, Select, message } from 'antd';
import { Query } from 'react-apollo';

import { connect } from 'dva';
import DraftList from './draft';
import PublishedList from './published';
import TrashList from './trash';

import { updatePost } from '@/services/write';
import client from '@/services/graphql-client';

import PostType from './postType';

import styles from './styles.less';
import { FIND_POST, GET_CATEGORIES, GET_TAGS } from '@/services/graphql/query';

const { TabPane } = Tabs;
const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const PostsList = ({ loading }) => {
  const [tabKey, setTabKey] = useState(PostType.published);
  const [subTitle, setSubTitle] = useState('');
  const [editId, setEditId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const onEdit = id => {
    setModalVisible(true);
    setEditId(id);
  };
  const changeType = type => async id => {
    try {
      await updatePost({ type }, id);
      message.success('操作成功');
      await client.resetStore();
    } catch (e) {
      message.error('操作失败');
    }
  };
  return (
    <>
      <PageHeader
        title="文章列表"
        subTitle={subTitle}
        footer={
          <Tabs onChange={activeKey => setTabKey(activeKey)}>
            <TabPane tab="已发布" key={PostType.published} />
            <TabPane tab="草稿" key={PostType.draft} />
            <TabPane tab="已删除" key={PostType.trash} />
          </Tabs>
        }
      />
      <div className={styles.postsList}>
        <Card bordered={false}>
          <Spin spinning={!!loading}>
            <Tabs tabBarStyle={{ display: 'none' }} activeKey={tabKey} animated={false}>
              <TabPane tab="已发布" key={PostType.published}>
                <PublishedList
                  setSubTitle={setSubTitle}
                  currentList={tabKey === PostType.published}
                  onEdit={onEdit}
                  onDelete={changeType(PostType.trash)}
                />
              </TabPane>
              <TabPane tab="草稿" key={PostType.draft}>
                <DraftList
                  setSubTitle={setSubTitle}
                  currentList={tabKey === PostType.draft}
                  onEdit={onEdit}
                  onDelete={changeType(PostType.trash)}
                />
              </TabPane>
              <TabPane tab="已删除" key={PostType.trash}>
                <TrashList
                  setSubTitle={setSubTitle}
                  currentList={tabKey === PostType.trash}
                  onRecovery={changeType(PostType.draft)}
                />
              </TabPane>
            </Tabs>
          </Spin>
        </Card>
      </div>
      <Query
        query={FIND_POST}
        skip={editId === null}
        variables={{ id: editId }}
        notifyOnNetworkStatusChange
      >
        {({ loading: modalLoading, data = {} }) => {
          const { post } = data;
          return (
            <EditModal
              visible={modalVisible}
              onCancel={() => setModalVisible(false)}
              loading={modalLoading}
              editId={editId}
              post={post}
            />
          );
        }}
      </Query>
    </>
  );
};
// 点击修改时的弹出窗
const EditModal = Form.create({
  mapPropsToFields({ post }) {
    if (!post) return undefined;
    const { title, type, categories, tags } = post;
    return {
      title: Form.createFormField({
        value: title,
      }),
      type: Form.createFormField({
        value: type,
      }),
      categories: Form.createFormField({
        value: categories,
      }),
      tags: Form.createFormField({
        value: tags,
      }),
    };
  },
})(({ form, visible, onCancel, editId, loading }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { getFieldDecorator } = form;
  const onSubmit = async () => {
    setConfirmLoading(true);
    const values = form.getFieldsValue();
    try {
      await updatePost(values, editId);
      message.success('操作成功');
      onCancel();
      await client.resetStore();
    } catch (e) {
      message.error('操作失败');
    } finally {
      setConfirmLoading(false);
    }
  };
  return (
    <Modal
      title="修改"
      visible={visible}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      onOk={onSubmit}
    >
      <Spin spinning={loading}>
        <Form layout="vertical">
          <FormItem label="标题">{getFieldDecorator('title')(<Input />)}</FormItem>
          <FormItem>
            {getFieldDecorator('type')(
              <RadioGroup>
                <Radio value={PostType.published}>已发布</Radio>
                <Radio value={PostType.draft}>草稿</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="分类">
            <Query query={GET_CATEGORIES}>
              {({ loading: categoriesLoading, data }) => {
                const { categories = [] } = data;
                return getFieldDecorator('categories')(
                  <Select mode="tags" loading={categoriesLoading}>
                    {categories.map(({ name }) => (
                      <Option key={name}>{name}</Option>
                    ))}
                  </Select>
                );
              }}
            </Query>
          </FormItem>
          <FormItem label="标签">
            <Query query={GET_TAGS}>
              {({ loading: tagsLoading, data }) => {
                const { tags = [] } = data;
                return getFieldDecorator('tags')(
                  <Select mode="tags" loading={tagsLoading}>
                    {tags.map(({ name }) => (
                      <Option key={name}>{name}</Option>
                    ))}
                  </Select>
                );
              }}
            </Query>
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  );
});

export default connect(({ loading: { models: { postsList } } }) => ({ loading: postsList }))(
  PostsList
);
