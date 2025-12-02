import React, { useState, useEffect } from 'react';
import './App.css';
import AccountList from './components/AccountList';
import AccountDetail from './components/AccountDetail';
import Login from './components/Login';
import { auth, fbSignOut, onAuthStateChanged, getRedirectResult, fbSetPersistence, browserLocalPersistence } from './firebase';

function App() {
  const [selected, setSelected] = useState(null);
  const firebaseProjectId = process.env.REACT_APP_FIRE_PROJECT_ID;
  const [user, setUser] = useState(null);

  const [authInit, setAuthInit] = useState(false);

  useEffect(()=>{
    console.log('App mounted, starting Auth checks...');
    
    // 2. Auth 상태 리스너
    const unsub = onAuthStateChanged(auth, u=>{
      console.log('auth state changed:', u ? u.email : 'null');
      setUser(u);
      if (!u) {
        setSelected(null);
      }
      setAuthInit(true);
    });
    return unsub;
  },[]);

  return (
    <div className="App">
      <header style={{padding:12, borderBottom:'1px solid #eee'}}>
        <h1>쉽계부</h1>
        <p style={{margin:0}}>쉽게 관리하는 가계부 — 빠르게 입력하고 한눈에 확인하세요.</p>
        <div style={{marginTop:6, fontSize:12, color:'#666'}}>
          프로젝트: {firebaseProjectId || '환경값 없음'} | 사용자: {user ? (user.email || user.uid) : '로그아웃'}
        </div>
      </header>

      <main>
        {!authInit && <div style={{padding:20, color:'#666'}}>로그인 상태 확인 중...</div>}
        {authInit && !user && <Login />}
        {authInit && user && (
          <div key={user.uid}>
            <div style={{display:'flex',gap:12,alignItems:'center',justifyContent:'flex-end',padding:8}}>
              <div style={{fontSize:12,color:'#444'}}>{user.email}</div>
              <button onClick={()=>fbSignOut(auth)}>로그아웃</button>
            </div>
            {!selected && <AccountList user={user} onSelect={acc=>setSelected(acc)} />}
            {selected && <AccountDetail user={user} account={selected} onBack={()=>setSelected(null)} />}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
