import React, { useState, useEffect } from 'react';
import { Layout, Button, Pagination, Spin, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard.jsx';
import CreatePostDrawer from '../components/CreatePostDrawer';
import { getPostList } from '../apis/postApi';
import './PostListPage.css';

const { Content } = Layout;

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();

  // 获取帖子列表
  const fetchPosts = async (page = currentPage, keyword = searchKeyword) => {
    setLoading(true);
    try {
      const response = await getPostList(page, pageSize, keyword);
      console.log('获取帖子列表响应:', response);
      
      // 兼容不同的响应格式
      const isSuccess = response?.success !== false && !response?.error;
      
      if (isSuccess) {
        // 处理不同的数据结构 - 支持Spring Boot分页格式
        const posts = response?.content || // Spring Boot分页格式
                     response?.data?.posts || 
                     response?.posts || 
                     response?.data || 
                     [];
        const total = response?.totalElements || // Spring Boot分页格式
                     response?.data?.total || 
                     response?.total || 
                     posts.length;
        
        console.log('解析后的帖子数据:', { posts, total, rawResponse: response });
        setPosts(posts);
        setTotal(total);
      } else {
        const errorMsg = response?.message || response?.msg || response?.error || '获取帖子列表失败';
        message.error(errorMsg);
      }
    } catch (error) {
      console.error('获取帖子列表错误:', error);
      message.error('获取帖子列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时获取数据
  useEffect(() => {
    fetchPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 处理分页变化
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchPosts(page);
  };



  // 处理帖子创建成功
  const handlePostCreated = () => {
    setDrawerVisible(false);
    // 重新获取第一页数据，确保能看到新创建的帖子
    setCurrentPage(1);
    setSearchKeyword(''); // 清空搜索关键词以显示所有帖子
    fetchPosts(1, ''); // 获取第一页的所有帖子
    console.log('帖子创建成功，正在刷新列表...');
  };

  // 处理卡片点击（跳转到详情页）
  const handleCardClick = (postId) => {
    console.log('点击帖子卡片，帖子ID:', postId);
    console.log('准备跳转到:', `/posts/${postId}`);
    navigate(`/posts/${postId}`);
  };

  return (
    <Layout className="post-list-layout">
      <Content className="post-list-content">
        {/* 页面头部 */}
        <div className="post-list-header">
          <h1 className="page-title">旅行分享</h1>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setDrawerVisible(true)}
            className="create-post-btn"
          >
            发布帖子
          </Button>
        </div>

        {/* 帖子列表 */}
        <Spin spinning={loading}>
          <div className="posts-container">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onCardClick={handleCardClick}
                  onRefresh={() => fetchPosts()}
                />
              ))
            ) : (
              <div className="empty-state">
                <p>暂无帖子</p>
              </div>
            )}
          </div>
        </Spin>

        {/* 分页 */}
        {total > 0 && (
          <div className="pagination-container">
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) =>
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }
            />
          </div>
        )}

        {/* 创建帖子抽屉 */}
        <CreatePostDrawer
          open={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          onSuccess={handlePostCreated}
        />
      </Content>
    </Layout>
  );
};

export default PostListPage;