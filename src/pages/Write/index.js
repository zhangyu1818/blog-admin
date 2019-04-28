import React, { useRef, useState, useEffect } from 'react';
import Markdown from 'react-markdown-mirror';
import { Button, Drawer, Icon, Input, PageHeader, Popover } from 'antd';
import { connect } from 'dva';

import moment from 'moment';

import client from '@/services/graphql-client';
import DrawerForm from './DrawerForm';

import styles from './styles.less';

import { addPost, getCategories, getTags, updatePost } from '@/services/write';

const InfoInner = ({ postedTime, updateTime, revisionCount }) => (
  <dl className={styles.infoInner}>
    <dt>创建日期：</dt>
    <dd>{postedTime ? moment(postedTime).format('YYYY年M月DD日 HH点mm分') : '暂无信息'}</dd>
    <dt>修改日期：</dt>
    <dd>{updateTime ? moment(updateTime).format('YYYY年M月DD日 HH点mm分') : '暂无信息'}</dd>
    <dt>修订次数：</dt>
    <dd>{`${revisionCount}次` || '暂无信息'}</dd>
  </dl>
);

const WritePage = ({ current, dispatch }) => {
  const [title, setTitle] = useState('');
  const [drawer, setDrawerVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [info, setInfo] = useState(null);
  const markdownEditor = useRef(null);
  const onCommit = async (other, id) => {
    const { markdown, html } = markdownEditor.current.getValue();
    const content = { title, markdown, content: html, ...other };
    // eslint-disable-next-line no-unused-vars
    try {
      if (id) return await updatePost(content, id);
      return await addPost(content);
    } catch (e) {
      return null;
    } finally {
      setDrawerVisible(false);
    }
  };
  useEffect(() => {
    getCategories().then(({ data }) => {
      const { categories: fetchCategories } = data;
      setCategories(fetchCategories);
    });
    getTags().then(({ data }) => {
      const { tags: fetchTags } = data;
      setTags(fetchTags);
    });
    return () => {
      // 如果categories和tags还没有fetch完成，unmount会报错，此方法停止所有graphql请求，不知道有没有副作用
      client.stop();
      dispatch({
        type: 'write/saveCurrent',
        post: null,
      });
    };
  }, []);
  useEffect(
    () => {
      if (current) {
        const { markdown, title: currentTitle, postedTime, updateTime, revisionCount } = current;
        setTitle(currentTitle);
        setInfo({
          postedTime,
          updateTime,
          revisionCount,
        });
        markdownEditor.current.setValue({ title: currentTitle, markdown });
      }
    },
    [current]
  );
  return (
    <div className={styles.markdown}>
      <PageHeader
        title={
          <Input
            className={styles.title}
            placeholder="输入文章标题..."
            size="large"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        }
        extra={
          <Button type="primary" onClick={() => setDrawerVisible(true)}>
            发布
          </Button>
        }
        className={styles.markdownHeader}
      />
      <Markdown
        ref={markdownEditor}
        title={false}
        containerClassName={styles.markdownContent}
        extra={
          <Popover
            content={<InfoInner {...info} />}
            placement="bottomRight"
            title="信息"
            trigger="click"
          >
            <Icon type="info" title="信息" className={styles.infoBtn} />
          </Popover>
        }
      />
      <Drawer title="发布" visible={drawer} onClose={() => setDrawerVisible(false)}>
        <DrawerForm onCommit={onCommit} categories={categories} tags={tags} />
      </Drawer>
    </div>
  );
};
export default connect(({ write }) => write)(WritePage);
