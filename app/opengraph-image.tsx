import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'World Cup 2026 AI Predictor';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0E1A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Blue top glow */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '55%',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0,61,165,0.5) 0%, transparent 70%)',
        }} />
        {/* Red bottom glow */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
          background: 'radial-gradient(ellipse at 50% 100%, rgba(212,23,30,0.35) 0%, transparent 70%)',
        }} />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          {/* Ball */}
          <div style={{ fontSize: 100, lineHeight: 1, marginBottom: 24 }}>⚽</div>

          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 14 }}>
            <span style={{ fontSize: 88, fontWeight: 900, color: 'white', letterSpacing: '-4px' }}>WC</span>
            <span style={{ fontSize: 88, fontWeight: 900, color: '#D4171E', letterSpacing: '-4px' }}>2026</span>
          </div>

          {/* Subtitle */}
          <div style={{
            fontSize: 36, fontWeight: 400, color: '#9CA3AF',
            marginBottom: 36, letterSpacing: '0.15em',
          }}>
            AI PREDICTOR
          </div>

          {/* Feature pills */}
          <div style={{ display: 'flex', gap: 14, marginBottom: 36 }}>
            {['Score Predictions', 'Corners & Cards', 'Monte Carlo Sims'].map(tag => (
              <div
                key={tag}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#D1D5DB',
                  padding: '8px 20px',
                  borderRadius: 9999,
                  fontSize: 19,
                }}
              >
                {tag}
              </div>
            ))}
          </div>

          {/* Gold CTA strip */}
          <div style={{
            background: '#C9A84C',
            color: '#0A0E1A',
            padding: '11px 32px',
            borderRadius: 9999,
            fontSize: 21,
            fontWeight: 800,
            letterSpacing: '0.04em',
          }}>
            ⚡ Statistical Modelling · 48 Teams · 104 Matches
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
