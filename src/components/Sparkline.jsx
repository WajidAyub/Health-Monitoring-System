import { useEffect, useRef } from 'react'

function Sparkline({ data = [], status = 'UP', width = 120, height = 40 }) {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    // Resolve CSS variables dynamically for Canvas
    const style = getComputedStyle(document.documentElement)
    const successColor = style.getPropertyValue('--success').trim() || '#10b981'
    const dangerColor = style.getPropertyValue('--danger').trim() || '#ef4444'
    const color = status === 'UP' ? successColor : dangerColor
    const dpr = window.devicePixelRatio || 1
    canvas.width  = width  * dpr
    canvas.height = height * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, width, height)

    if (data.length < 2) {
      ctx.fillStyle = style.getPropertyValue('--text-3').trim() || '#94a3b8'
      ctx.font = '9px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Waiting…', width / 2, height / 2 + 3)
      return
    }

    const max   = Math.max(...data.map(v => Math.min(v, 10000)), 100)
    const pad   = 4
    const points = data.map((v, i) => ({
      x: pad + (i / (data.length - 1)) * (width  - pad * 2),
      y: pad + (1 - Math.min(v, 10000) / max) * (height - pad * 2)
    }))

    // Gradient fill
    ctx.beginPath()
    ctx.moveTo(points[0].x, height)
    points.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.lineTo(points[points.length - 1].x, height)
    ctx.closePath()
    const grad = ctx.createLinearGradient(0, 0, 0, height)
    grad.addColorStop(0, color + '55')
    grad.addColorStop(1, color + '00')
    ctx.fillStyle = grad
    ctx.fill()

    // Smooth line
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      const cpx = (points[i - 1].x + points[i].x) / 2
      ctx.bezierCurveTo(cpx, points[i - 1].y, cpx, points[i].y, points[i].x, points[i].y)
    }
    ctx.strokeStyle = color
    ctx.lineWidth   = 1.5
    ctx.lineJoin    = 'round'
    ctx.stroke()

    // Latest dot
    const last = points[points.length - 1]
    ctx.beginPath()
    ctx.arc(last.x, last.y, 2.5, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }, [data, status, width, height])

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height, display: 'block' }}
      title={data.length ? `Latest: ${data[data.length - 1]}ms` : 'No data yet'}
    />
  )
}

export default Sparkline
