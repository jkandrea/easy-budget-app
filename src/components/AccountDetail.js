import React, { useEffect, useState } from 'react';
import { db, doc, updateDoc, collection, addDoc, onSnapshot, query, orderBy } from '../firebase';

export default function AccountDetail({ account, onBack }){
  const [local, setLocal] = useState(account);
  const [lastEnding, setLastEnding] = useState(account?.lastMonthEnding ?? 0);
  const [starting, setStarting] = useState(account?.startingAmount ?? account?.lastMonthEnding ?? 0);
  const [transactions, setTransactions] = useState([]);
  const [txDesc, setTxDesc] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('Other');

  useEffect(()=>{
    setLocal(account);
    setLastEnding(account?.lastMonthEnding ?? 0);
    // 이번달 시작 잔액은 기본적으로 지난달 마감액과 동일하게 사용합니다.
    setStarting(account?.startingAmount ?? account?.lastMonthEnding ?? 0);
    // If there's no account or the account hasn't been saved (no id), clear transactions and skip subscribing.
    if (!account || !account.id) {
      setTransactions([]);
      return;
    }
    const q = query(collection(db, `accounts/${account.id}/transactions`), orderBy('createdAt','desc'));
    const unsub = onSnapshot(q, snap=>{
      setTransactions(snap.docs.map(d=>({id:d.id,...d.data()})));
    });
    return unsub;
  },[account]);

  async function saveBalances(){
    if (!account || !account.id) {
      // eslint-disable-next-line no-alert
      alert('계정이 아직 없습니다. 첫번째 계정을 추가하세요.');
      return;
    }
    try {
      const ref = doc(db, 'accounts', account.id);
      // 이번달 시작 잔액은 지난달 마감액을 그대로 사용합니다.
      const startVal = Number(lastEnding);
      await updateDoc(ref, { lastMonthEnding: Number(lastEnding), startingAmount: startVal });
      setStarting(startVal);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to save balances:', err);
      // eslint-disable-next-line no-alert
      alert('잔액 저장 중 오류가 발생했습니다. 콘솔을 확인하세요.');
    }
  }

  async function addTransaction(){
    if(!txDesc || !txAmount) return;
    if (!account || !account.id) {
      // eslint-disable-next-line no-alert
      alert('계정이 아직 없습니다. 첫번째 계정을 추가하세요.');
      return;
    }
    try {
      await addDoc(collection(db, `accounts/${account.id}/transactions`), {
        description: txDesc,
        amount: Number(txAmount),
        category: txCategory,
        createdAt: Date.now()
      });
      setTxDesc(''); setTxAmount('');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to add transaction:', err);
      // eslint-disable-next-line no-alert
      alert('내역 추가 중 오류가 발생했습니다. 콘솔을 확인하세요.');
    }
  }

  return (
    <div style={{padding:20}}>
      <button onClick={onBack}>← 뒤로</button>
      <h2>{local?.nickname} — {local?.bank}</h2>

      <div style={{marginTop:12}}>
        <h4>이번 달 시작 잔액 (쉽게)</h4>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <div>
            <label>지난달 마감액</label><br/>
            <input value={lastEnding} onChange={e=>setLastEnding(e.target.value)} />
          </div>
          <div>
            <label>이번달 시작 잔액 (자동)</label><br/>
            <div style={{padding:8, border:'1px solid #ddd', borderRadius:4}}>{starting}원</div>
          </div>
          <div>
            <button onClick={saveBalances}>저장</button>
          </div>
        </div>
        <p style={{color:'#666'}}>이번달 시작 잔액은 자동으로 지난달 마감액과 같아집니다. 지난달 실제 수치가 기억나지 않으면 지난달 마감액을 업데이트하세요.</p>
      </div>

      <div style={{marginTop:16}}>
        <h4>거래 내역 (나중에 그룹 등록 가능)</h4>
        <div style={{display:'flex',gap:8}}>
          <input placeholder="내역" value={txDesc} onChange={e=>setTxDesc(e.target.value)} />
          <input placeholder="금액" value={txAmount} onChange={e=>setTxAmount(e.target.value)} />
          <input placeholder="카테고리 (예: 카드, 보험)" value={txCategory} onChange={e=>setTxCategory(e.target.value)} />
          <button onClick={addTransaction}>추가</button>
        </div>

        <div style={{marginTop:12}}>
          {transactions.map(t=> (
            <div key={t.id} style={{borderBottom:'1px solid #eee', padding:8}}>
              <div><strong>{t.description}</strong> — {t.category}</div>
              <div style={{color:'#333'}}>{t.amount}원</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
