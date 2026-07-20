import type { Metadata } from 'next';
import { SyncSettingsView } from '@/views/settings';

export const metadata: Metadata = { title: '설정 | 해도돼?' };

export default function SettingsPage() {
  return <SyncSettingsView />;
}