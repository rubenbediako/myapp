import { ImageResponse } from 'next/og'
import { Bot } from 'lucide-react';

export const runtime = 'edge'
export const size = {
  width: 32,
  height: 32,
}

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'hsl(209.1 40% 11.2%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '6px'
        }}
      >
        <Bot size={24} />
      </div>
    ),
    {
      ...size,
    }
  )
}
