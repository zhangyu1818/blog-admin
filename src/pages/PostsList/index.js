import React, { useState } from 'react';
import { Tabs, Card, PageHeader, Spin, Modal, Form, Input, Radio, Select } from 'antd';
import { Query } from 'react-apollo';

import { connect } from 'dva';
import DraftList from './draft';
import PublishedList from './published';
import TrashList from './trash';

import PostType from './postType';

import styles from './styles.less';
import { GET_CATEGORIES, GET_TAGS } from '@/services/graphql/query';

const { TabPane } = Tabs;
const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const PostsList = ({ loading, form }) => {
  const [tabKey, setTabKey] = useState(PostType.published);
  const [subTitle, setSubTitle] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const { getFieldDecorator } = form;
  const onEdit = async id => {
    setModalVisible(true);
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
                />
              </TabPane>
              <TabPane tab="草稿" key={PostType.draft}>
                <DraftList setSubTitle={setSubTitle} currentList={tabKey === PostType.draft} />
              </TabPane>
              <TabPane tab="已删除" key={PostType.trash}>
                <TrashList setSubTitle={setSubTitle} currentList={tabKey === PostType.trash} />
              </TabPane>
            </Tabs>
          </Spin>
        </Card>
      </div>
      <Modal title="修改" visible={modalVisible} onCancel={() => setModalVisible(false)}>
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
      </Modal>
    </>
  );
};

export default connect(({ loading: { models: { postsList } } }) => ({ loading: postsList }))(
  Form.create()(PostsList)
);
