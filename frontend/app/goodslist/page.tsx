"use client";
import { useEffect, useState } from "react";

type GoodsItem = {
  id: number;
  name: string;
  category: string;
  price_per_day: number;
  status: string;
  image: string;
  description: string;
  owner_name: string;
};

export default function GoodsList() {
  const [goods, setGoods] = useState<GoodsItem[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [filterCategory, setFilterCategory] = useState("全部");
  const [borrowGoodsId, setBorrowGoodsId] = useState<number | null>(null);
  const [borrowerName, setBorrowerName] = useState("");
  const [borrowDays, setBorrowDays] = useState("");
  const [needMove, setNeedMove] = useState(false);
  const [borrowResult, setBorrowResult] = useState<string | null>(null);

  const loadGoods = () => {
    fetch(`http://127.0.0.1:5000/api/goods?category=${filterCategory}`)
      .then(res => res.json())
      .then(data => setGoods(data.data));
  };

  useEffect(() => {
    loadGoods();
  }, [filterCategory]);

  const submitAdd = async () => {
    if (!name || !price) {
      alert("请填写物品名称和单日租金");
      return;
    }

    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : 1;
    const userName = user ? JSON.parse(user).username : "匿名";

    await fetch("http://127.0.0.1:5000/api/add_goods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, category, price_per_day: price, description,
        owner_id: userId, owner_name: userName
      })
    });
    setName("");
    setCategory("");
    setPrice("");
    setDescription("");
    loadGoods();
  };

  const deleteGoods = async (id: number) => {
    if (!confirm("确定删除这个物品吗？")) return;
    await fetch(`http://127.0.0.1:5000/api/delete_goods/${id}`, {
      method: "DELETE"
    });
    loadGoods();
  };

  const submitBorrow = async (goodsId: number) => {
    if (!borrowerName || !borrowDays) {
      alert("请填写借用人姓名和借用天数");
      return;
    }

    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : 1;

    const res = await fetch("http://127.0.0.1:5000/api/borrow_goods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goods_id: goodsId,
        borrower_id: userId,
        borrower_name: borrowerName,
        days: borrowDays,
        need_move: needMove
      })
    });

    const data = await res.json();
    if (data.code === 200) {
      let msg = `借用成功！应付租金：${data.total_rent} 元`;
      if (data.move_fee) msg += `（含搬运费：${data.move_fee} 元）`;
      setBorrowResult(msg);
      setBorrowGoodsId(null);
      setBorrowerName("");
      setBorrowDays("");
      setNeedMove(false);
      loadGoods();
    } else {
      alert(data.msg);
    }
  };

  const returnGoods = async (id: number) => {
    if (!confirm("确认归还这个物品吗？")) return;
    await fetch(`http://127.0.0.1:5000/api/return_goods/${id}`, {
      method: "POST"
    });
    loadGoods();
  };

  const getCategoryTag = (category: string) => {
    if (category.includes("工具")) return { className: "tag-tool", text: "工具" };
    if (category.includes("家电")) return { className: "tag-appliance", text: "家电" };
    if (category.includes("户外")) return { className: "tag-outdoor", text: "户外" };
    return { className: "tag-tool", text: category };
  };

  const getCategoryEmoji = (category: string) => {
    if (category.includes("工具")) return "🔧";
    if (category.includes("家电")) return "📺";
    if (category.includes("户外")) return "⛺";
    return "📦";
  };

  return (
    <div className="container">
      <div className="card">
        <div style={{ fontSize: '30px', marginBottom: '10px' }}>📦</div>
        <h1 style={{ fontSize: '24px', color: '#667eea' }}>闲置物品发布与列表</h1>

        <div style={{ marginBottom: '24px', padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
          <h3 style={{ marginBottom: '15px', color: '#555' }}>发布新物品</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              placeholder="物品名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '180px' }}
            />
            <input
              placeholder="分类（工具/家电/户外）"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '180px' }}
            />
            <input
              placeholder="单日租金（元）"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ width: '120px' }}
            />
            <input
              placeholder="物品描述（选填）"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '250px' }}
            />
            <button onClick={submitAdd}>发布闲置</button>
          </div>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', color: '#555' }}>分类筛选：</span>
          {["全部", "维修工具", "影音家电", "户外用品"].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={filterCategory === cat ? "" : "btn-secondary"}
              style={filterCategory === cat ? {} : { background: '#f0f0f0', color: '#333' }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div>
          <h3 style={{ marginBottom: '15px', color: '#555' }}>可借用物品（共 {goods.length} 件）</h3>
          {goods.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '30px' }}>暂无物品，快来发布吧！</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {goods.map(item => {
                const tag = getCategoryTag(item.category);
                const isBorrowed = item.status === "borrowed";
                return (
                  <div key={item.id} style={{
                    background: isBorrowed ? '#fff3e0' : '#fafafa',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #eee',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '40px'
                      }}>
                        {getCategoryEmoji(item.category)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 'bold', color: '#333', fontSize: '16px' }}>{item.name}</span>
                          <span className={`tag ${tag.className}`}>{tag.text}</span>
                          {isBorrowed && (
                            <span style={{ color: '#f57c00', fontSize: '12px', fontWeight: 'bold' }}>已借出</span>
                          )}
                        </div>
                        <p style={{ color: '#888', fontSize: '13px', marginTop: '5px' }}>
                          {item.description || '暂无描述'}
                        </p>
                        <p style={{ color: '#aaa', fontSize: '12px' }}>发布者：{item.owner_name}</p>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '15px',
                      borderTop: '1px solid #eee'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea' }}>
                        ¥{item.price_per_day}/天
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {isBorrowed ? (
                          <button
                            onClick={() => returnGoods(item.id)}
                            className="btn-secondary"
                            style={{ background: '#e8f5e9', color: '#388e3c' }}
                          >
                            归还
                          </button>
                        ) : (
                          <button onClick={() => setBorrowGoodsId(item.id)}>
                            借用
                          </button>
                        )}
                        <button
                          onClick={() => deleteGoods(item.id)}
                          className="btn-secondary"
                          style={{ background: '#ffebee', color: '#c62828' }}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {borrowGoodsId && (
          <div style={{
            marginTop: '25px',
            padding: '25px',
            background: '#e3f2fd',
            borderRadius: '12px',
            border: '2px solid #90caf9'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#1976d2', fontSize: '18px' }}>📝 填写借用信息</h3>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>借用人姓名</label>
                <input
                  placeholder="请输入姓名"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  style={{ width: '200px' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>借用天数</label>
                <input
                  placeholder="请输入天数"
                  value={borrowDays}
                  onChange={(e) => setBorrowDays(e.target.value)}
                  style={{ width: '150px' }}
                />
              </div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#555',
                padding: '10px 15px',
                background: '#fff',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={needMove}
                  onChange={(e) => setNeedMove(e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <div>
                  <span>🚚 需要搬运服务</span>
                  <span style={{ color: '#f57c00', fontSize: '12px', marginLeft: '5px' }}>(额外30%费用)</span>
                </div>
              </label>
              <button onClick={() => submitBorrow(borrowGoodsId)} style={{ height: '42px' }}>
                确认借用
              </button>
              <button
                onClick={() => { setBorrowGoodsId(null); setBorrowerName(""); setBorrowDays(""); setNeedMove(false); }}
                className="btn-secondary"
                style={{ background: '#f0f0f0', color: '#333', height: '42px' }}
              >
                取消
              </button>
            </div>
          </div>
        )}

        {borrowResult && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            background: '#e8f5e9',
            borderRadius: '10px',
            color: '#388e3c',
            fontWeight: 'bold',
            fontSize: '16px',
            textAlign: 'center'
          }}>
            ✅ {borrowResult}
          </div>
        )}

        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
          <a href="/">← 返回首页</a>
        </div>
      </div>
    </div>
  );
}