import { Bookmark, BookmarkCheck, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { getRiskStyles } from '@/shared/lib/risk';
import { evaluateSourceTrust } from '@/shared/lib/sourceTrust';
import type { Warning } from '../model/types';

interface WarningCardProps {
  item: Warning;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onClick: (item: Warning) => void;
}

export const WarningCard = ({ item, isSaved, onToggleSave, onClick }: WarningCardProps) => {
  const styles = getRiskStyles(item.risk);
  const RiskIcon = styles.icon;
  const linkedSources = (item.sources ?? []).filter((source) => source.url);
  const firstSource = linkedSources[0];
  const firstSourceTrust = firstSource ? evaluateSourceTrust(firstSource) : null;
  const statusLabel = item.status === 'VERIFIED'
    ? '검수 완료'
    : item.status === 'STALE'
      ? '재검토 필요'
      : '검수 중';
  const verifiedDate = item.verifiedAt
    ? new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' }).format(new Date(item.verifiedAt))
    : null;

  return (
    <div
      onClick={() => onClick(item)}
      className="bg-white rounded-[16px] p-5 md:p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all cursor-pointer group relative flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2 items-center">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-noto text-[11px] font-bold tracking-tight ${styles.bg} ${styles.text} ${styles.border} border`}
          >
            <RiskIcon size={12} strokeWidth={2.5} />
            {item.risk}
          </span>
          <span className="text-gray-500 font-noto text-[12px] font-medium bg-gray-50 px-2 py-1 rounded-md">
            {item.category}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(item.id);
          }}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors -mr-1.5 -mt-1.5 text-gray-400 hover:text-black focus:outline-none"
          aria-label={isSaved ? '저장 취소' : '저장하기'}
        >
          {isSaved ? <BookmarkCheck size={20} className="text-black fill-black" /> : <Bookmark size={20} />}
        </button>
      </div>

      <h3 className="font-noto font-bold text-[17px] md:text-[19px] leading-[1.4] text-black mb-3 group-hover:text-gray-700 transition-colors line-clamp-2">
        {item.title}
      </h3>

      <p className="font-noto text-[14px] text-gray-600 leading-[1.5] mb-5 line-clamp-2 flex-grow">
        {item.reason || item.alternative}
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl bg-gray-50 px-3 py-2.5 text-[11px] text-gray-600">
        <span className="inline-flex items-center gap-1 font-noto font-semibold text-gray-700">
          <ShieldCheck size={13} /> {statusLabel}
        </span>
        {firstSource ? (
          <a
            href={firstSource.url ?? undefined}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center gap-1 font-noto font-semibold text-blue-700 hover:underline"
            aria-label={`${firstSource.title} 출처 열기`}
          >
            <span className="max-w-[150px] truncate">{firstSource.title}</span>
            <span className="text-gray-500">· {firstSourceTrust?.hostname}</span>
            <ExternalLink size={11} />
          </a>
        ) : (
          <span className="font-noto text-amber-700">출처 확인 중</span>
        )}
        {firstSourceTrust && (
          <span
            className={firstSourceTrust.level === 'OFFICIAL_DOMAIN'
              ? 'font-noto font-semibold text-emerald-700'
              : firstSourceTrust.level === 'HTTPS_SOURCE'
                ? 'font-noto font-semibold text-blue-700'
                : 'font-noto font-semibold text-amber-700'}
          >
            {firstSourceTrust.label}
            {firstSourceTrust.isStale ? ' · 재확인 필요' : ''}
          </span>
        )}
        {linkedSources.length > 1 && (
          <span className="font-noto text-gray-500">외 {linkedSources.length - 1}개</span>
        )}
        {verifiedDate && <span className="font-noto text-gray-500">최종 확인 {verifiedDate}</span>}
      </div>

      <div className="pt-4 border-t border-gray-100 mt-auto flex justify-between items-center">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-noto text-gray-400">적용 범위</span>
          <span className="text-[12px] font-noto font-medium text-gray-800">{item.range}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
};
