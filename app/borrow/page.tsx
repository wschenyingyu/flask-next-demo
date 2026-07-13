"use client";
import { useEffect, useState } from "react";

type BorrowRecord = {
  id: number;
  goods_id: number;
  goods_name: string;
  borrower_name: string;
  days: number;
  total_rent: number;
  borrow_date: string;
  return_date: string | null;
  status: string;
};

export default function BorrowPage() {
  const [records, setRecords] = useState<BorrowRecord[]>([]);

  const loadRecords = () => {
    fetch("http://127.0.0.1:5000/api/borrow_records")
      .then(res => res.json())
      .then(data => setRecords(data.data));
  };

  useEffect(() => {
    loadRecords();
  }, []);

  return (
    <div className="container">
      <div className="card">
        <div style={{ fontSize: '30px', marginBottom: '10px' }}>📋</div>
        <h1 style={{ fontSize: '24px', color: '#667eea' }}>借用记录</h1>
        <p style={{ color: '#888', marginBottom: '20px' }}>查看所有物品的借出和归还记录</p>

        {records.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '30px' }}>暂无借用记录</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', color: '#555' }}>物品</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', color: '#555' }}>借用人</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', color: '#555' }}>天数</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', color: '#555' }}>租金</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', color: '#555' }}>借出时间</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', color: '#555' }}>归还时间</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', color: '#555' }}>状态</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.id}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{record.goods_name}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{record.borrower_name}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{record.days} 天</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', color: '#667eea', fontWeight: 'bold' }}>¥{record.total_rent}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontSize: '13px', color: '#888' }}>{record.borrow_date}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontSize: '13px', color: '#888' }}>
                      {record.return_date || '-'}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                      {record.status === 'borrowed' ? (
                        <span style={{ color: '#f57c00', fontWeight: 'bold' }}>借出中</span>
                      ) : (
                        <span style={{ color: '#388e3c', fontWeight: 'bold' }}>已归还</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
          <a href="/">← 返回首页</a>
        </div>
      </div>
    </div>
  );
}