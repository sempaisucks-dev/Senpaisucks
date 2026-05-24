import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') ?? 'Kagenime';
    const subtitle = searchParams.get('subtitle') ?? '';

    return new ImageResponse(
      (
        <div style={{
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(90deg,#6C3CE1 0%, #3A2BD8 100%)',
          color: 'white',
          padding: 48,
          boxSizing: 'border-box',
          fontFamily: 'Inter, Roboto, system-ui, -apple-system, "Segoe UI", sans-serif',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 36, fontWeight: 700 }}>{title}</div>
            {subtitle && <div style={{ marginTop: 12, fontSize: 24, opacity: 0.9 }}>{subtitle}</div>}
          </div>

          <div style={{ width: 200, height: 200, borderRadius: 16, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 64, fontWeight: 800 }}>K</div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e) {
    return new Response('Failed to generate image', { status: 500 });
  }
}
