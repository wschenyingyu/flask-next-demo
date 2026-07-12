"use client";
import { useEffect, useState, useRef } from "react";

type Activity = {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  organizer_name: string;
  created_at: string;
};

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    if (activities.length > 1) {
      slideInterval.current = window.setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % activities.length);
      }, 4000);
    }
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [activities.length]);

  const loadActivities = () => {
    fetch("http://127.0.0.1:5000/api/activities")
      .then(res => res.json())
      .then(data => {
        console.log("活动数据:", data.data);
        setActivities(data.data);
      })
      .catch(err => {
        console.error("加载活动失败:", err);
      });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date || !location) {
      alert("请填写完整信息");
      return;
    }

    setUploading(true);
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : 1;
    const userName = user ? JSON.parse(user).username : "匿名";

    try {
      const res = await fetch("http://127.0.0.1:5000/api/add_activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description, date, location,
          organizer_id: userId, organizer_name: userName
        })
      });

      const data = await res.json();
      console.log("发布结果:", data);

      if (data.code === 200 && imageFile) {
        // 获取最新活动的ID
        const allRes = await fetch("http://127.0.0.1:5000/api/activities");
        const allData = await allRes.json();
        const latestActivity = allData.data[0];
        
        if (latestActivity) {
          // 上传图片
          const formData = new FormData();
          formData.append("file", imageFile);
          formData.append("activity_id", latestActivity.id.toString());
          
          const uploadRes = await fetch("http://127.0.0.1:5000/api/upload_activity_image", {
            method: "POST",
            body: formData
          });
          
          const uploadData = await uploadRes.json();
          console.log("图片上传结果:", uploadData);
        }
      }

      setShowForm(false);
      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
      setImageFile(null);
      setPreviewImage("");
      loadActivities();
      alert("活动发布成功！");
    } catch (err) {
      console.error("发布失败:", err);
      alert("发布失败，请重试");
    } finally {
      setUploading(false);
    }
  };

  const handleJoinActivity = (activity: Activity) => {
    const user = localStorage.getItem("user");
    if (!user) {
      alert("请先登录！");
      window.location.href = "/login";
      return;
    }
    alert(`🎉 报名成功！\n活动：${activity.title}\n时间：${activity.date}\n地点：${activity.location}`);
  };

  const getActivityEmoji = (index: number) => {
    const emojis = ["🎉", "🔥", "📚", "❤️", "🎨", "⚽", "🎭"];
    return emojis[index % emojis.length];
  };

  const getActivityColor = (index: number) => {
    const colors = [
      "#667eea", "#f57c00", "#388e3c", "#1976d2",
      "#7b1fa2", "#c62828", "#00838f"
    ];
    return colors[index % colors.length];
  };

  const getImageUrl = (image: string) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `http://127.0.0.1:5000/uploads/${image}`;
  };

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '30px', marginBottom: '10px' }}>🎉</div>
            <h1 style={{ fontSize: '24px', color: '#667eea' }}>社区活动</h1>
            <p style={{ color: '#888' }}>参与社区活动，增进邻里关系</p>
          </div>
          <button onClick={() => setShowForm(true)} style={{ padding: '12px 25px' }}>
            📝 发布活动
          </button>
        </div>

        {showForm && (
          <div style={{
            marginBottom: '25px',
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '10px'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#555' }}>发布新活动</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555' }}>活动标题 *</label>
                <input
                  placeholder="请输入活动标题"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555' }}>活动时间 *</label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555' }}>活动地点 *</label>
                <input
                  placeholder="请输入活动地点"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>
              <div style={{ flex: '1 1 100%' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555' }}>活动图片</label>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ flex: '1' }}
                  />
                  {previewImage && (
                    <img 
                      src={previewImage} 
                      alt="预览" 
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #ddd' }}
                    />
                  )}
                </div>
              </div>
              <div style={{ flex: '1 1 100%' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555' }}>活动描述</label>
                <textarea
                  placeholder="请输入活动描述..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', height: '80px', padding: '10px', border: '2px solid #ddd', borderRadius: '8px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={uploading}>
                  {uploading ? '发布中...' : '发布活动'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setImageFile(null); setPreviewImage(""); }} className="btn-secondary" style={{ background: '#f0f0f0', color: '#333' }}>取消</button>
              </div>
            </form>
          </div>
        )}

        {activities.length > 0 && (
          <div style={{
            marginBottom: '30px',
            overflow: 'hidden',
            borderRadius: '15px',
            position: 'relative',
            height: '320px'
          }}>
            <div
              style={{
                display: 'flex',
                transition: 'transform 0.5s ease',
                transform: `translateX(-${currentSlide * 100}%)`,
                height: '100%'
              }}
            >
              {activities.map((activity, index) => {
                const imgUrl = getImageUrl(activity.image);
                return (
                  <div
                    key={activity.id}
                    style={{
                      minWidth: '100%',
                      height: '100%',
                      background: imgUrl
                        ? `url(${imgUrl}) center/cover`
                        : `linear-gradient(135deg, ${getActivityColor(index)} 0%, ${getActivityColor(index + 1)} 100%)`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'white',
                      textAlign: 'center',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0,0,0,0.4)'
                    }} />
                    <div style={{ position: 'relative', zIndex: 1, padding: '40px' }}>
                      <div style={{ fontSize: '60px', marginBottom: '15px' }}>{getActivityEmoji(index)}</div>
                      <h2 style={{ fontSize: '28px', marginBottom: '12px', fontWeight: 'bold' }}>{activity.title}</h2>
                      <p style={{ fontSize: '15px', opacity: '0.95', marginBottom: '15px', maxWidth: '600px' }}>{activity.description || '暂无描述'}</p>
                      <div style={{ display: 'flex', gap: '20px', fontSize: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <div>📅 {activity.date}</div>
                        <div>📍 {activity.location}</div>
                        <div>👤 {activity.organizer_name}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '10px',
              zIndex: 2
            }}>
              {activities.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: 'none',
                    background: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    transition: 'background 0.3s'
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? activities.length - 1 : prev - 1))}
              style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                padding: '10px',
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: 2
              }}
            >
              ◀
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % activities.length)}
              style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                padding: '10px',
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: 2
              }}
            >
              ▶
            </button>
          </div>
        )}

        <div>
          {activities.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '30px' }}>暂无社区活动，快来发布第一个活动吧！</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {activities.map((activity, index) => {
                const imgUrl = getImageUrl(activity.image);
                return (
                  <div key={activity.id} style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderLeft: `5px solid ${getActivityColor(index)}`
                  }}>
                    <div style={{
                      height: '160px',
                      background: imgUrl
                        ? `url(${imgUrl}) center/cover`
                        : `linear-gradient(135deg, ${getActivityColor(index)} 0%, ${getActivityColor(index + 1)} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '50px',
                      color: 'white'
                    }}>
                      {imgUrl ? null : getActivityEmoji(index)}
                    </div>
                    <div style={{ padding: '18px' }}>
                      <h3 style={{ color: '#333', marginBottom: '10px', fontSize: '17px' }}>{activity.title}</h3>
                      <p style={{ color: '#888', fontSize: '13px', marginBottom: '15px', lineHeight: '1.5', height: '40px', overflow: 'hidden' }}>
                        {activity.description || '暂无描述'}
                      </p>
                      <div style={{ fontSize: '13px', color: '#555' }}>
                        <div style={{ marginBottom: '4px' }}>📅 {activity.date}</div>
                        <div style={{ marginBottom: '4px' }}>📍 {activity.location}</div>
                        <div style={{ color: '#888', fontSize: '11px' }}>
                          组织人：{activity.organizer_name}
                        </div>
                      </div>
                      <button 
                        style={{ width: '100%', marginTop: '15px', background: getActivityColor(index), padding: '10px', fontSize: '14px' }}
                        onClick={() => handleJoinActivity(activity)}
                      >
                        👍 我要参加
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}