import { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusCircle, RefreshCw, X } from 'lucide-react';
import PostCard from './components/PostCard';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State quản lý việc hiển thị Form bài viết mới
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '' });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Gọi đúng cổng 3000 của Backend
      const response = await axios.get('http://localhost:3000/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error("Lỗi kết nối Backend:", error);
      alert("Không thể tải dữ liệu từ server!");
    } finally {
      setLoading(false);
    }
  };

  // Hàm gửi bài viết mới lên Backend
  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/posts', newPost);
      setNewPost({ title: '', content: '', author: '' }); // Reset form
      setShowForm(false); // Đóng form
      fetchPosts(); // Tải lại danh sách bài mới
    } catch (error) {
      alert("Lỗi khi đăng bài!");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  

  return (
    <div className="container">
      <header>
        <div className="actions">
          <button className="btn-secondary" onClick={fetchPosts}><RefreshCw size={18} /></button>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <PlusCircle size={18} /> Viết bài mới
          </button>
        </div>
      </header>

      {/* MODAL FORM THÊM BÀI VIẾT */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Tạo bài viết mới</h2>
              <button className="btn-close" onClick={() => setShowForm(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreatePost}>
              <input 
                placeholder="Tiêu đề bài viết" 
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                required 
              />
              <input 
                placeholder="Tên tác giả" 
                value={newPost.author}
                onChange={(e) => setNewPost({...newPost, author: e.target.value})}
              />
              <textarea 
                placeholder="Nội dung bài viết..." 
                rows="5"
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                required
              />
              <button type="submit" className="btn-submit">Đăng bài ngay</button>
            </form>
          </div>
        </div>
      )}

      <main>
        {loading ? (
          <div className="loader">Đang đồng bộ dữ liệu với Backend...</div>
        ) : (
          <div className="post-grid">
            {posts.length > 0 ? (
              posts.map(post => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="empty-state">Chưa có bài viết nào trong database.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;