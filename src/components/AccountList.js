import React, { useEffect, useState } from 'react';
import { db, collection, onSnapshot, query, orderBy, addDoc } from '../firebase';

export default function AccountList({ user, onSelect }) {
  const [accounts, setAccounts] = useState([]);
  const [nick, setNick] = useState('');
  const [bank, setBank] = useState('');

  useEffect(() => {
    if (!user) { setAccounts([]); return undefined; }
    const q = query(collection(db, 'userAccounts', user.uid, 'accounts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAccounts(arr);
    });
    return unsub;
  }, [user?.uid]);

  async function handleAdd() {
    if (!nick.trim() || !bank.trim()) return;
    try {
      const now = Date.now();
      // 사용자별 계정(userAccounts/{uid}/accounts)에 직접 추가
      // 상위 accounts 컬렉션은 사용하지 않음
      await addDoc(collection(db, 'userAccounts', user.uid, 'accounts'), {
        nickname: nick.trim(),
        bank: bank.trim(),
        role: 'owner',
        createdAt: now,
        lastMonthEnding: 0,
        startingAmount: 0
      });
      
      setNick(''); setBank('');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to add account:', err);
      // eslint-disable-next-line no-alert
      alert('통장 추가 중 오류가 발생했습니다. 콘솔을 확인하세요.');
    }
  }

  return (
    <div style={{padding:20}}>
      <h2>통장 목록</h2>
      <div>
        {accounts.map(a => (
          <div key={a.id} style={{border:'1px solid #ddd', padding:10, marginBottom:8, borderRadius:6}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <div onClick={() => onSelect(a)} style={{cursor:'pointer'}}>
                <strong>{a.nickname}</strong> — {a.bank}
              </div>
              <div style={{color:'#666'}}>{a.startingAmount ?? 0}원</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:16}}>
        <h4>통장 추가</h4>
        <input placeholder="닉네임" value={nick} onChange={e=>setNick(e.target.value)} />
        <input placeholder="은행" value={bank} onChange={e=>setBank(e.target.value)} style={{marginLeft:8}} />
        <button onClick={handleAdd} style={{marginLeft:8}}>추가</button>
      </div>
    </div>
  );
}
