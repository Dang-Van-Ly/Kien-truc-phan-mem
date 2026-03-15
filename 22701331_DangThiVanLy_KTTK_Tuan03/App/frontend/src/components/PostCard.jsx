import { Clock, FileText, User } from 'lucide-react';

const PostCard = ({ post }) => {
  return (
    <article className="post-card">
      <h2>{post.title}</h2>
      <p className="content">{post.content}</p>
      
      <div className="post-meta">
        <span><User size={14} /> {post.author}</span>
        {/* Dữ liệu từ timestampPlugin của Backend */}
        <span><Clock size={14} /> {post.createdAt || 'Vừa xong'}</span>
        {/* Dữ liệu từ wordCountPlugin của Backend */}
        <span><FileText size={14} /> {post.wordCount} từ</span>
      </div>
    </article>
  );
};

export default PostCard;