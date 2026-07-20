import Link from 'next/link';
import { MapPinOff } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f8f8] px-5 font-noto">
      <section className="w-full max-w-lg rounded-3xl bg-white p-9 text-center shadow-sm">
        <MapPinOff className="mx-auto text-gray-300" size={42} />
        <p className="mt-5 text-sm font-bold text-gray-500">404</p>
        <h1 className="mt-2 text-2xl font-bold">여행지를 찾을 수 없어요.</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">주소가 바뀌었거나 아직 제공하지 않는 여행지일 수 있습니다.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-black px-5 py-3 text-sm font-medium text-white">여행지 다시 찾기</Link>
      </section>
    </main>
  );
}