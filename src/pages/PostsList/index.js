import React, { useState } from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Card, Table, Tag, PageHeader } from 'antd';

import moment from 'moment';

import styles from './styles.less';

const { Column } = Table;

const LIMIT_POSTS = gql`
  query limit($currentPage: Int, $pageSize: Int) {
    limitPosts(pagination: { currentPage: $currentPage, pageSize: $pageSize }) {
      pagination {
        currentPage
        pageSize
        total
      }
      posts {
        _id
        title
        postedTime
        updateTime
        revisionCount
        categories
        tags
      }
    }
  }
`;

const defaultValue = {
  pagination: {
    currentPage: 1,
    pageSize: 10,
  },
  posts: [],
};

const renderTag = items =>
  items.length !== 0 ? items.map(item => <Tag key={item}>{item}</Tag>) : '无';

const PostsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const onTableChange = ({ current, pageSize: currentPageSize }) => {
    setCurrentPage(current);
    setPageSize(currentPageSize);
  };
  return (
    <Query query={LIMIT_POSTS} variables={{ currentPage, pageSize }}>
      {({ loading, error, data }) => {
        const { limitPosts = defaultValue } = data;
        const { pagination, posts } = limitPosts;
        setTotal(pagination.total);
        return (
          <>
            <PageHeader title="文章列表" subTitle={`共${total}篇文章`} />
            <div className={styles.postsList}>
              <Card bordered={false}>
                <Table
                  rowKey="_id"
                  dataSource={posts}
                  onChange={onTableChange}
                  pagination={{ current: currentPage, pageSize, total, showSizeChanger: true }}
                  loading={loading}
                >
                  <Column title="名称" dataIndex="title" />
                  <Column
                    title="提交日期"
                    dataIndex="postedTime"
                    render={text => moment(text).format('YYYY年M月DD日 HH点mm分')}
                  />
                  <Column
                    title="修改日期"
                    dataIndex="updateTime"
                    render={text =>
                      text ? moment(text).format('YYYY年M月DD日 HH点mm分') : '暂无数据'
                    }
                  />
                  <Column title="修订次数" dataIndex="revisionCount" />
                  <Column title="种类" dataIndex="categories" render={renderTag} />
                  <Column title="标签" dataIndex="tags" render={renderTag} />
                </Table>
              </Card>
            </div>
          </>
        );
      }}
    </Query>
  );
};

export default PostsList;
