import React, { useEffect, useState } from 'react';
import { Query } from 'react-apollo';
import { Divider, Table, Tag } from 'antd';

import moment from 'moment';

import { LIMIT_POSTS } from '@/services/graphql/query';
import { findPost } from '@/services/write';

import router from 'umi/router';
import { connect } from 'dva';
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

const DraftList = ({ setSubTitle, currentList, dispatch, onEdit }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const onTableChange = ({ current, pageSize: currentPageSize }) => {
    setCurrentPage(current);
    setPageSize(currentPageSize);
  };
  const onClickEdit = async id => {
    const { data } = await findPost(id);
    const { post } = data;
    dispatch({
      type: 'write/saveCurrent',
      post,
    });
    router.push('/posts/write');
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
    <Query query={LIMIT_POSTS} variables={{ currentPage, pageSize, type: PostType.draft }}>
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
            <Column
              title="操作"
              dataIndex="_id"
              key="action"
              render={id => (
                <>
                  <a onClick={() => onEdit(id)}>修改</a>
                  <Divider type="vertical" />
                  <a onClick={() => onClickEdit(id)}>修改</a>
                </>
              )}
            />
          </Table>
        );
      }}
    </Query>
  );
};

export default connect()(DraftList);
