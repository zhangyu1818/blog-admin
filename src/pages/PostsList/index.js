import React, { useState } from 'react';
import { Tabs, Card, PageHeader } from 'antd';

import DraftList from './draft';
import PublishedList from './published';
import TrashList from './trash';

import PostType from './postType';

import styles from './styles.less';

const { TabPane } = Tabs;

const PostsList = () => {
  const [tabKey, setTabKey] = useState(PostType.published);
  const [subTitle, setSubTitle] = useState('');
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
        </Card>
      </div>
    </>
  );
};

export default PostsList;
