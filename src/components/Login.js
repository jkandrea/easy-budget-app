import React, { useState } from 'react';
import { auth, googleProvider, /* facebookProvider, */ signInWithRedirect, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, fbSetPersistence, browserLocalPersistence, browserSessionPersistence } from '../firebase';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  // useEffect(() => {
  //   getRedirectResult(auth)... handled in App.js
  // }, []);

  async function signInGoogle(){
    try {
      await fbSetPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Google sign-in failed', err);
      // eslint-disable-next-line no-alert
      alert(`구글 로그인 실패: ${err.code || ''} ${err.message || ''}`);
    }
  }

  // getRedirectResult는 사용하지 않습니다. onAuthStateChanged가 최종 로그인 상태를 알려줍니다.

  // async function signInFacebook(){
  //   try {
  //     await fbSetPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  //     await signInWithPopup(auth, facebookProvider);
  //   } catch (err) {
  //     console.error('Facebook sign-in failed', err);
  //     alert('페이스북 로그인에 실패했습니다. 콘솔을 확인하세요.');
  //   }
  // }

  const [isSignup, setIsSignup] = useState(false);

  async function signInEmail(e){
    e.preventDefault();
    try {
      await fbSetPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Email sign-in failed', err);
      // eslint-disable-next-line no-alert
      alert(`이메일 로그인 실패: ${err.code || ''} ${err.message || ''}`);
    }
  }

  async function signUpEmail(e){
    e.preventDefault();
    try {
      await fbSetPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      await createUserWithEmailAndPassword(auth, email, password);
      // 가입 성공 시 자동 로그인됩니다.
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Email sign-up failed', err);
      // eslint-disable-next-line no-alert
      alert(`회원가입 실패: ${err.code || ''} ${err.message || ''}`);
    }
  }

  return (
    <div style={{padding:20}}>
      <h2>로그인</h2>
      <p>계속하려면 로그인하세요. 계정이 없으면 구글 로그인으로 새 계정을 만들 수 있습니다.</p>

      <div style={{marginBottom:12, display:'flex', gap:8, alignItems:'center'}}>
        <button onClick={signInGoogle}>Google로 계속하기</button>
        {/* <button onClick={signInFacebook}>Facebook으로 계속하기</button> */}
      </div>

      <div style={{marginTop:8, marginBottom:8}}>
        <button onClick={()=>setIsSignup(s=>!s)}>{isSignup ? '로그인으로 돌아가기' : '이메일로 회원가입'}</button>
      </div>

      <form onSubmit={isSignup ? signUpEmail : signInEmail} style={{display:'flex',flexDirection:'column',gap:8,maxWidth:320}}>
        <input placeholder="이메일" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="비밀번호" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <label style={{fontSize:12}}><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} /> 로그인 상태 유지 (기본)</label>
        <div>
          <button type="submit">{isSignup ? '회원가입' : '이메일로 로그인'}</button>
        </div>
      </form>

      <p style={{color:'#666',marginTop:12}}>보안 팁: '로그인 상태 유지'를 끄면 세션은 탭을 닫을 때 만료됩니다. 더 엄격한 보안이 필요하면 주기적으로 로그아웃 로직을 추가하세요.</p>
    </div>
  );
}
