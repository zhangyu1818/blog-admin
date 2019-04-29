import React, { useEffect, useState } from 'react';
import { Query } from 'react-apollo';
import { Table, Tag } from 'antd';

import moment from 'moment';

import { LIMIT_POSTS } from '@/services/graphql/query';

import PostType from './postType';

const { Column } = Table;

const defaultValue = {
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 0,
  },
  posts: [],
};

const renderTag = items =>
  items.length !== 0 ? items.map(item => <Tag key={item}>{item}</Tag>) : '无';

const DraftList = ({ setSubTitle, currentList }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const onTableChange = ({ current, pageSize: currentPageSize }) => {
    setCurrentPage(current);
    setPageSize(currentPageSize);
  };
  useEffect(
    () => {
      if (currentList) {
        setSubTitle(`共${total}篇`);
      }
    },
    [currentList, total]
  );
  return (
    <Query
      query={LIMIT_POSTS}
      variables={{ currentPage, pageSize, type: PostType.trash }}
    >
      {({ loading, data }) => {
        const { limitPosts = defaultValue } = data;
        const { pagination, posts } = limitPosts;
        setTotal(pagination.total);
        return (
          <Table
            rowKey="_id"
            dataSource={posts}
            onChange={onTableChange}
            pagination={{ current: currentPage, pageSize, total, showSizeChanger: true }}
            loading={loading}
          >
            <Column title="标题" dataIndex="title" />
            <Column
              title="提交日期"
              dataIndex="postedTime"
              render={text => moment(text).format('YYYY年M月DD日 HH点mm分')}
            />
            <Column
              title="修改日期"
              dataIndex="updateTime"
              render={text => (text ? moment(text).format('YYYY年M月DD日 HH点mm分') : '暂无数据')}
            />
            <Column title="修订次数" dataIndex="revisionCount" />
            <Column title="分类" dataIndex="categories" render={renderTag} />
            <Column title="标签" dataIndex="tags" render={renderTag} />
          </Table>
        );
      }}
    </Query>
  );
};

export default DraftList;
