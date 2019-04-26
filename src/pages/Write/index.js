import React, { useRef, useState, useEffect } from 'react';
import Markdown from 'react-markdown-mirror';
import { Button, Drawer, Icon, Input, PageHeader, Popover } from 'antd';
import DrawerForm from './DrawerForm';
import styles from './styles.less';
import { addPost, getCategories, getTags } from '@/services/write';

const InfoInner = () => (
  <dl className={styles.infoInner}>
    <dt>创建日期：</dt>
    <dd>暂无信息</dd>
    <dt>修改日期：</dt>
    <dd>暂无信息</dd>
    <dt>修订次数：</dt>
    <dd>暂无信息</dd>
  </dl>
);

const WritePage = () => {
  const [title, onTitleChange] = useState('');
  const [drawer, setDrawerVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const markdownEditor = useRef(null);
  const Info = () => (
    <Popover content={<InfoInner />} placement="bottomRight" title="信息" trigger="click">
      <Icon type="info" title="信息" className={styles.infoBtn} />
    </Popover>
  );
  const onCommit = async () => {
    const { markdown, html } = markdownEditor.current.getValue();
    const content = { title, markdown, content: html };
    const data = await addPost(content);
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
  }, []);
  return (
    <div className={styles.markdown}>
      <PageHeader
        title={
          <Input
            className={styles.title}
            placeholder="输入文章标题..."
            size="large"
            value={title}
            onChange={({ target }) => onTitleChange(target.value)}
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
        extra={<Info />}
      />
      <Drawer title="发布" visible={drawer} onClose={() => setDrawerVisible(false)}>
        <DrawerForm onCommit={onCommit} categories={categories} tags={tags} />
      </Drawer>
    </div>
  );
};
export default WritePage;
