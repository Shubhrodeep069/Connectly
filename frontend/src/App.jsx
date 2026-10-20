
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Heart, MessageCircle, House, Search, PlusSquare,
  UserRound, LogOut, Users, Send, Trash2, Sparkles
} from "lucide-react";
import "./index.css";

const API = "http://localhost:5000/api";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("connectlyToken") || ""
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("connectlyUser") || "null")
  );
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: ""
  });
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [commentText, setCommentText] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const api = axios.create({
    baseURL: API,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  const loadPosts = async () => {
    try {
      const response = await axios.get(`${API}/posts`);
      setPosts(response.data);
    } catch {
      setMessage("Could not load posts. Check your backend server.");
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const endpoint = isRegister ? "register" : "login";
      const payload = isRegister
        ? form
        : { email: form.email, password: form.password };

      const response = await axios.post(
        `${API}/auth/${endpoint}`,
        payload
      );

      if (isRegister) {
        setMessage("Account created! Please log in.");
        setIsRegister(false);
        setForm({ name: "", email: form.email, password: "" });
      } else {
        const { token: newToken, user: newUser } = response.data;
        localStorage.setItem("connectlyToken", newToken);
        localStorage.setItem("connectlyUser", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        setMessage("");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("connectlyToken");
    localStorage.removeItem("connectlyUser");
    setToken("");
    setUser(null);
    setForm({ name: "", email: "", password: "" });
    setMessage("You have logged out.");
  };


  const createPost = async (e) => {
    e.preventDefault();

    if (!content.trim() && !imageUrl.trim()) return;

    try {
      await api.post("/posts", {
  content: content.trim(),
  image: imageUrl.trim()
});

      setContent("");
      setImageUrl("");
      setMessage("");
      await loadPosts();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not create post."
      );
    }
  };


  const toggleLike = async (postId) => {
    try {
      await api.put(`/posts/${postId}/like`);
      await loadPosts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not update like.");
    }
  };

  const addComment = async (postId) => {
    const text = commentText[postId]?.trim();
    if (!text) return;

    try {
      await api.post(`/posts/${postId}/comments`, { text });
      setCommentText((prev) => ({ ...prev, [postId]: "" }));
      await loadPosts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not add comment.");
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm("Delete this post permanently?")) return;

    try {
      await api.delete(`/posts/${postId}`);
      await loadPosts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not delete post.");
    }
  };

  const filteredPosts = posts.filter((post) => {
    const text = `${post.content || ""} ${post.author?.name || ""}`;
    return text.toLowerCase().includes(search.toLowerCase());
  });

  if (!token || !user) {
    return (
      <main className="auth-page">
        <section className="auth-visual">
          <div className="brand brand-light">
            <Sparkles size={27} /> Connectly
          </div>
          <div className="auth-hero">
            <span className="eyebrow">YOUR PEOPLE. YOUR SPACE.</span>
            <h1>Make connections<br />that matter.</h1>
            <p>Share your moments, exchange ideas, and stay close to your community.</p>
            <div className="floating-emoji">💙 ✨ 🌍</div>
          </div>
          <p className="auth-footer">A little more connected, every day.</p>
        </section>

        <section className="auth-form-side">
          <form className="auth-card" onSubmit={handleAuth}>
            <div className="mobile-brand brand">
              <Sparkles size={24} /> Connectly
            </div>
            <span className="eyebrow">WELCOME TO CONNECTLY</span>
            <h2>{isRegister ? "Create your account" : "Welcome back!"}</h2>
            <p className="muted">
              {isRegister
                ? "Join the community and start sharing."
                : "Sign in to catch up with your community."}
            </p>

            {isRegister && (
              <label>
                Full name
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                />
              </label>
            )}

            <label>
              Email address
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </label>

            <label>
              Password
              <input
                required
                minLength={8}
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 8 characters"
              />
            </label>

            {message && <p className="notice">{message}</p>}

            <button className="primary-btn" disabled={loading}>
              {loading
                ? "Please wait..."
                : isRegister ? "Create account" : "Sign in"}
            </button>

            <p className="auth-switch">
              {isRegister ? "Already a member?" : "New to Connectly?"}{" "}
              <button
                type="button"
                className="text-btn"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setMessage("");
                }}
              >
                {isRegister ? "Sign in" : "Create account"}
              </button>
            </p>
          </form>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home">
          <Sparkles size={26} /> Connectly
        </a>
        <div className="top-search">
          <Search size={18} />
          <input
            placeholder="Search posts or people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="icon-btn logout-btn" onClick={logout} title="Log out">
          <LogOut size={19} /> <span>Logout</span>
        </button>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <div className="profile-mini">
            <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
            <div>
              <strong>{user.name}</strong>
              <span>@{user.name?.toLowerCase().replace(/\s+/g, "")}</span>
            </div>
          </div>
          <nav className="nav-menu">
            <a className="nav-link active" href="#home">
              <House size={20} /> Home Feed
            </a>
            <a className="nav-link" href="#community">
              <Users size={20} /> Community
            </a>
            <a className="nav-link" href="#create">
              <PlusSquare size={20} /> Create a post
            </a>
            <a className="nav-link" href="#profile">
              <UserRound size={20} /> My profile
            </a>
          </nav>
          <div className="sidebar-note">
            <Sparkles size={20} />
            <strong>Spread good energy.</strong>
            <p>Your next conversation could make someone's day.</p>
          </div>
          <p className="side-copyright">© 2026 Connectly</p>
        </aside>

        <main className="feed-column" id="home">
          <div className="feed-heading">
            <div>
              <span className="eyebrow">YOUR COMMUNITY</span>
              <h1>Home Feed <span>👋</span></h1>
              <p className="muted">See what's happening around you.</p>
            </div>
            <span className="online-pill">● You're connected</span>
          </div>

          {message && (
            <div className="notice feed-notice">
              {message}
              <button className="text-btn" onClick={() => setMessage("")}>
                Dismiss
              </button>
            </div>
          )}

          <form className="create-card" id="create" onSubmit={createPost}>
            <div className="create-top">
              <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`What's on your mind, ${user.name?.split(" ")[0]}?`}
                maxLength={2000}
                rows={3}
              />

              <input
                className="image-url-input"
                type="text"
                placeholder="Optional: paste an image URL..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />

            </div>
            <div className="create-bottom">
              <span className="muted">{content.length}/2000 characters</span>
              <button className="primary-btn post-btn" disabled={!content.trim() && !imageUrl.trim()}>
                <Send size={16} /> Share post
              </button>
            </div>
          </form>

          <div className="section-label">
            <h2>Latest posts</h2>
            <span>{filteredPosts.length} posts</span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="empty-card">
              <div className="empty-icon"><MessageCircle size={28} /></div>
              <h3>{search ? "No matching posts" : "Your feed is waiting!"}</h3>
              <p>
                {search
                  ? "Try a different search term."
                  : "Be the first to share something with your community."}
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const liked = post.likes?.some(
                (id) => String(id) === String(user.id)
              );

              return (
                <article className="post-card" key={post._id}>
                  <div className="post-header">
                    <div className="avatar">
                      {post.author?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="post-author">
                      <strong>{post.author?.name || "Connectly User"}</strong>
                      <span>
                        {new Date(post.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {String(post.author?._id) === String(user.id) && (
                      <button
                        className="icon-btn delete-btn"
                        onClick={() => deletePost(post._id)}
                        title="Delete post"
                      >
                        <Trash2 size={17} />
                      </button>
                    )}
                  </div>

                  {post.content && <p className="post-content">{post.content}</p>}

                  {post.image && (
                    <img className="post-image" src={post.image} alt="Post" />
                  )}

                  <div className="post-stats">
                    <span><Heart size={15} /> {post.likes?.length || 0} likes</span>
                    <span>{post.comments?.length || 0} comments</span>
                  </div>

                  <div className="post-actions">
                    <button
                      className={`action-btn ${liked ? "liked" : ""}`}
                      onClick={() => toggleLike(post._id)}
                    >
                      <Heart size={19} fill={liked ? "currentColor" : "none"} />
                      {liked ? "Liked" : "Like"}
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => document.getElementById(`comment-${post._id}`)?.focus()}
                    >
                      <MessageCircle size={19} /> Comment
                    </button>
                  </div>

                  {post.comments?.map((comment, index) => (
                    <div className="comment-row" key={comment._id || index}>
                      <div className="comment-avatar">
                        {comment.user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="comment-bubble">
                        <strong>{comment.user?.name || "User"}</strong>
                        <p>{comment.text}</p>
                      </div>
                    </div>
                  ))}

                  <form
                    className="comment-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      addComment(post._id);
                    }}
                  >
                    <input
                      id={`comment-${post._id}`}
                      placeholder="Write a comment..."
                      value={commentText[post._id] || ""}
                      onChange={(e) =>
                        setCommentText({
                          ...commentText,
                          [post._id]: e.target.value
                        })
                      }
                      maxLength={500}
                    />
                    <button
                      type="submit"
                      className="comment-submit"
                      disabled={!commentText[post._id]?.trim()}
                      aria-label="Send comment"
                    >
                      <Send size={17} />
                    </button>
                  </form>
                </article>
              );
            })
          )}
        </main>

        <aside className="right-column">
          <div className="welcome-card">
            <div className="welcome-art"><Sparkles size={29} /></div>
            <span className="eyebrow">A SPACE FOR EVERYONE</span>
            <h3>Good things happen when we connect.</h3>
            <p>Share your thoughts, appreciate others, and grow together.</p>
          </div>
          <div className="tips-card">
            <h3>Community reminders ✨</h3>
            <p>💙 Be kind and respectful.</p>
            <p>🌱 Share ideas that inspire.</p>
            <p>🤝 Make room for different voices.</p>
          </div>
          <div className="right-footer">
            About · Community Guidelines · Privacy
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
