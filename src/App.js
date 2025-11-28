import React, { useState } from 'react';
import './App.css';
import AccountList from './components/AccountList';
import AccountDetail from './components/AccountDetail';

function App() {
  const [selected, setSelected] = useState(null);
  const firebaseProjectId = process.env.REACT_APP_FIRE_PROJECT_ID;

  return (
    <div className="App">
      <header style={{padding:12, borderBottom:'1px solid #eee'}}>
        <h1>쉽계부</h1>
        <p style={{margin:0}}>쉽게 관리하는 가계부 — 빠르게 입력하고 한눈에 확인하세요.</p>
      </header>

      <main>
        <div style={{padding:12, background:'#fff8dc', borderBottom:'1px solid #f0e0b0'}}>
          <strong>Firebase 프로젝트:</strong> {firebaseProjectId || '(설정 없음 - .env 확인)'}
        </div>
        {!selected && <AccountList onSelect={acc=>setSelected(acc)} />}
        {selected && <AccountDetail account={selected} onBack={()=>setSelected(null)} />}
      </main>
    </div>
  );
}

export default App;
