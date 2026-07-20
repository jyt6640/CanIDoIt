'use client';

import Link from 'next/link';
import { useState } from 'react';
import { replaceSavedItems, SAVED_ITEMS_STORAGE_KEY } from '@/features/warning-save/model/useSavedItems';

const TOKEN_KEY = 'hedodwae:sync-token';
const readSaved = () => JSON.parse(window.localStorage.getItem(SAVED_ITEMS_STORAGE_KEY) ?? '[]') as string[];

export const SyncSettingsView = () => {
  const [token, setToken] = useState(() => typeof window === 'undefined' ? '' : window.localStorage.getItem(TOKEN_KEY) ?? '');
  const [input, setInput] = useState('');
  const [notifyChanges, setNotifyChanges] = useState(false);
  const [message, setMessage] = useState('');

  const save = async (nextToken = token, notify = notifyChanges) => {
    const response = await fetch(`/api/sync/${nextToken}`, {
      method: 'PUT', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ warningKeys: readSaved(), notifyChanges: notify }),
    });
    setMessage(response.ok ? '저장 목록을 동기화했어요.' : '동기화에 실패했어요.');
  };

  const start = async () => {
    const nextToken = crypto.randomUUID();
    window.localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    await save(nextToken, notifyChanges);
  };

  const connect = async () => {
    const response = await fetch(`/api/sync/${input.trim()}`);
    if (!response.ok) return setMessage('동기화 코드를 확인해 주세요.');
    const data = await response.json() as { warningKeys: string[]; notifyChanges: boolean; changes: { title: string }[] };
    replaceSavedItems(data.warningKeys);
    window.localStorage.setItem(TOKEN_KEY, input.trim());
    setToken(input.trim());
    setNotifyChanges(data.notifyChanges);
    setMessage(data.changes.length ? `규정이 변경된 저장 항목 ${data.changes.length}개가 있어요.` : '이 기기에 저장 목록을 연결했어요.');
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-5 py-12 font-noto">
      <section className="mx-auto max-w-xl rounded-3xl bg-white p-7 shadow-sm">
        <Link href="/" className="text-sm text-gray-500">← 홈으로</Link>
        <h1 className="mt-5 text-3xl font-bold">설정</h1>
        <h2 className="mt-8 text-lg font-bold">기기 간 저장 목록 동기화</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">계정 대신 무작위 공유 코드를 사용합니다. 코드를 아는 사람은 저장 목록을 볼 수 있으므로 비밀번호처럼 보관하세요.</p>
        {!token ? (
          <button type="button" onClick={start} className="mt-5 rounded-full bg-black px-5 py-3 text-sm font-medium text-white">동기화 시작</button>
        ) : (
          <div className="mt-5 rounded-xl bg-gray-50 p-4">
            <p className="break-all text-xs text-gray-600">동기화 코드: {token}</p>
            <button type="button" onClick={() => void save()} className="mt-3 rounded-full bg-black px-4 py-2 text-sm text-white">지금 동기화</button>
          </div>
        )}
        <div className="mt-6 flex gap-2">
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="다른 기기의 동기화 코드" className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm" />
          <button type="button" onClick={connect} className="rounded-xl border px-4 text-sm">연결</button>
        </div>
        <label className="mt-6 flex items-center gap-3 text-sm">
          <input type="checkbox" checked={notifyChanges} onChange={(event) => { setNotifyChanges(event.target.checked); if (token) void save(token, event.target.checked); }} />
          저장한 규정 변경사항을 설정 화면에서 확인
        </label>
        {message && <p className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-800">{message}</p>}
        <p className="mt-8 text-xs leading-5 text-gray-500">분석 동의는 브라우저 사이트 데이터에서 `hedodwae:analytics-consent` 항목을 삭제하면 다시 선택할 수 있습니다.</p>
      </section>
    </main>
  );
};