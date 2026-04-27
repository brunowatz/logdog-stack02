'use client';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  style?: React.CSSProperties;
}

export default function Skeleton({ width = '100%', height = 16, radius = 6, style }: SkeletonProps) {
  return (
    <span
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ height = 140 }: { height?: number }) {
  return <div className="skeleton" style={{ height, borderRadius: 16 }} aria-hidden="true" />;
}

export function SkeletonRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}>
      <span className="skeleton" style={{ width: 44, height: 44, borderRadius: 12 }} aria-hidden="true" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span className="skeleton" style={{ width: '40%', height: 14, borderRadius: 6 }} aria-hidden="true" />
        <span className="skeleton" style={{ width: '60%', height: 12, borderRadius: 6 }} aria-hidden="true" />
      </div>
    </div>
  );
}
