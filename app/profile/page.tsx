"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [myGoods, setMyGoods] = useState<any[]>([]);
  const [myBorrows, setMyBorrows] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("goods");
  const [showEditModal, setShowEditModal] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editUsername, setEditUsername] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      window.location.href = "/login";
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    setEditPhone(parsedUser.phone || "");
    setEditUsername(parsedUser.username || "");

    fetch(`http://127.0.0.1:5000/api/user/${parsedUser.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) {
          setUser(data.data);
          setEditPhone(data.data.phone || "");
          setEditUsername(data.data.username || "");
        }
      });

    fetch("http://127.0.0.1:5000/api/goods")
      .then(res => res.json())
      .then(data => {
        const filtered = data.data.filter((g: any) => g.owner_id === parsedUser.id);
        setMyGoods(filtered);
      });

    fetch(`http://127.0.0.1:5000/api/borrow_records?user_id=${parsedUser.id}`)
      .then(res => res.json())
      .then(data => {
        setMyBorrows(data.data);
      });
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (avatarFile) {
      const formData = new FormData();
      formData.append("file", avatarFile);
      formData.append("user_id", user.id.toString());
      
      const res = await fetch("http://127.0.0.1:5000/api/upload_avatar", {
        method: "POST",
        body: formData
      });
      
      const data = await res.json();
      if (data.code === 200) {
        user.avatar = data.avatar;
        localStorage.setItem("user", JSON.stringify(user));
      }
    }

    if (editUsername !== user.username || editPhone !== user.phone) {
      const res = await fetch(`http://127.0.0.1:5000/api/update_user/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: editUsername, phone: editPhone })
      });
      
      const data = await res.json();
      if (data.code === 200) {
        user.username = editUsername;
        user.phone = editPhone;
        localStorage.setItem("user", JSON.stringify(user));
      }
    }

    setShowEditModal(false);
    setAvatarFile(null);
    setPreviewAvatar("");
    alert("保存成功！");
  };

  const getCategoryTag = (category: string) => {
    if (category.includes("工具")) return { className: "tag-tool", text: "工具" };
    if (category.includes("家电")) return { className: "tag-appliance", text: "家电" };
    if (category.includes("户外")) return { className: "tag-outdoor", text: "户外" };
    return { className: "tag-tool", text: category };
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  const avatarUrl = user.avatar 
    ? `http://127.0.0.1:5000/uploads/${user.avatar}`
    : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.username;

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '35px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '50px',
              overflow: 'hidden',
              border: '4px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              {user.avatar || previewAvatar ? (
                <img 
                  src={previewAvatar || avatarUrl} 
                  alt="头像" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                "👤"
              )}
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              style={{
                position: 'absolute',
                bottom: '5px',
                right: '5px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#667eea',
                border: '2px solid white',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✏️
            </button>
          </div>
          <div>
            <h1 style={{ fontSize: '26px', color: '#333', marginBottom: '8px' }}>{user.username}</h1>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>📧 {user.email}</p>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>
              📱 {user.phone || '未填写'} | 🎯 {user.role === 'admin' ? '管理员' : '普通用户'}
            </p>
            <p style={{ color: '#aaa', fontSize: '12px' }}>📅 注册时间：{user.created_at}</p>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              marginLeft: 'auto',
              padding: '10px 20px',
              background: '#ffebee',
              color: '#c62828',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔒 退出登录
          </button>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', paddingBottom: '20px', borderBottom: '2px solid #eee' }}>
          <button
            onClick={() => setActiveTab("goods")}
            style={activeTab === "goods" ? {} : { background: '#f0f0f0', color: '#333' }}
          >
            📦 我的发布 ({myGoods.length})
          </button>
          <button
            onClick={() => setActiveTab("borrows")}
            style={activeTab === "borrows" ? {} : { background: '#f0f0f0', color: '#333' }}
          >
            📋 我的借用 ({myBorrows.length})
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            style={activeTab === "stats" ? {} : { background: '#f0f0f0', color: '#333' }}
          >
            📊 数据统计
          </button>
        </div>

        {activeTab === "goods" && (
          <div>
            {myGoods.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '60px', marginBottom: '15px' }}>📦</div>
                <p style={{ color: '#999', fontSize: '16px' }}>暂无发布的物品</p>
                <button onClick={() => window.location.href = "/goodslist"} style={{ marginTop: '15px' }}>
                  去发布
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {myGoods.map((item: any) => {
                  const tag = getCategoryTag(item.category);
                  return (
                    <div key={item.id} style={{
                      background: item.status === 'borrowed' ? '#fff3e0' : '#fafafa',
                      borderRadius: '12px',
                      padding: '20px',
                      borderLeft: `5px solid ${tag.className === 'tag-tool' ? '#667eea' : tag.className === 'tag-appliance' ? '#f57c00' : '#388e3c'}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <div>
                          <span style={{ fontWeight: 'bold', color: '#333', fontSize: '18px' }}>{item.name}</span>
                          <span className={`tag ${tag.className}`} style={{ marginLeft: '10px' }}>{tag.text}</span>
                          {item.status === 'borrowed' && <span style={{ color: '#f57c00', fontSize: '12px', marginLeft: '10px', fontWeight: 'bold' }}>已借出</span>}
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea' }}>
                          ¥{item.price_per_day}/天
                        </div>
                      </div>
                      <p style={{ color: '#888', fontSize: '14px', marginBottom: '15px', lineHeight: '1.5' }}>
                        {item.description || '暂无描述'}
                      </p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {item.status === 'borrowed' && (
                          <button 
                            onClick={() => {
                              fetch(`http://127.0.0.1:5000/api/return_goods/${item.id}`, { method: 'POST' })
                                .then(() => window.location.reload());
                            }}
                            className="btn-secondary"
                            style={{ background: '#e8f5e9', color: '#388e3c' }}
                          >
                            确认归还
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('确定删除这个物品吗？')) {
                              fetch(`http://127.0.0.1:5000/api/delete_goods/${item.id}`, { method: 'DELETE' })
                                .then(() => window.location.reload());
                            }
                          }}
                          className="btn-secondary"
                          style={{ background: '#ffebee', color: '#c62828' }}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "borrows" && (
          <div>
            {myBorrows.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '60px', marginBottom: '15px' }}>📋</div>
                <p style={{ color: '#999', fontSize: '16px' }}>暂无借用记录</p>
                <button onClick={() => window.location.href = "/goodslist"} style={{ marginTop: '15px' }}>
                  去借物品
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {myBorrows.map((record: any) => (
                  <div key={record.id} style={{
                    background: '#fafafa',
                    borderRadius: '12px',
                    padding: '20px',
                    borderLeft: `5px solid ${record.status === 'borrowed' ? '#f57c00' : '#388e3c'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <span style={{ fontWeight: 'bold', color: '#333', fontSize: '18px' }}>{record.goods_name}</span>
                      <span style={{
                        color: record.status === 'borrowed' ? '#f57c00' : '#388e3c',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}>
                        {record.status === 'borrowed' ? '🔄 借出中' : '✅ 已归还'}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
                      <div>👤 借用人：{record.borrower_name}</div>
                      <div>📅 天数：{record.days} 天</div>
                      <div>💰 租金：¥{record.total_rent}</div>
                      {record.need_move ? <div style={{ color: '#f57c00' }}>🚚 含搬运费：¥{record.move_fee}</div> : null}
                      <div>📆 借出：{record.borrow_date}</div>
                      {record.return_date && <div>📆 归还：{record.return_date}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "stats" && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              padding: '25px',
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>📦</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}>{myGoods.length}</div>
              <div style={{ fontSize: '14px', opacity: '0.9' }}>发布物品数</div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
              borderRadius: '12px',
              padding: '25px',
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>📋</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}>{myBorrows.length}</div>
              <div style={{ fontSize: '14px', opacity: '0.9' }}>借用记录数</div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
              borderRadius: '12px',
              padding: '25px',
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>✅</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}>
                {myBorrows.filter((r: any) => r.status === 'returned').length}
              </div>
              <div style={{ fontSize: '14px', opacity: '0.9' }}>已归还数</div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
              borderRadius: '12px',
              padding: '25px',
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>💰</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}>
                ¥{myBorrows.reduce((sum: number, r: any) => sum + r.total_rent, 0)}
              </div>
              <div style={{ fontSize: '14px', opacity: '0.9' }}>累计消费</div>
            </div>
          </div>
        )}

        {showEditModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              width: '400px',
              maxWidth: '90%'
            }}>
              <h3 style={{ fontSize: '20px', marginBottom: '20px', textAlign: 'center' }}>编辑个人资料</h3>
              
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: '#667eea',
                  margin: '0 auto 15px',
                  overflow: 'hidden',
                  border: '3px solid #eee'
                }}>
                  {previewAvatar || (user.avatar ? <img src={avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : "👤")}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555' }}>用户名</label>
                <input
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555' }}>手机号</label>
                <input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={handleSaveProfile} style={{ flex: 1 }}>保存</button>
                <button 
                  onClick={() => { setShowEditModal(false); setAvatarFile(null); setPreviewAvatar(""); }} 
                  className="btn-secondary"
                  style={{ flex: 1, background: '#f0f0f0', color: '#333' }}
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}