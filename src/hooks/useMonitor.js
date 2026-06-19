import { useState, useEffect, useRef, useCallback } from 'react'

const CHECK_INTERVAL_MS = 30_000  // 30 s between checks
const TIMEOUT_MS        = 8_000   // 8 s fetch timeout
const MAX_HISTORY       = 20      // sparkline data points
const MAX_EVENTS        = 50      // activity feed entries

async function checkUrl(url) {
  const controller = new AbortController()
  const tid = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const t0 = performance.now()
  try {
    await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: controller.signal })
    clearTimeout(tid)
    return { status: 'UP', responseTime: Math.round(performance.now() - t0) }
  } catch (err) {
    clearTimeout(tid)
    return {
      status: 'DOWN',
      responseTime: err.name === 'AbortError' ? TIMEOUT_MS : Math.round(performance.now() - t0)
    }
  }
}

export function useMonitor(initialServices, onStatusChange) {
  const [liveServices, setLiveServices] = useState(() =>
    initialServices.map(s => ({
      ...s,
      history: [],
      isChecking: false,
      lastCheckedAt: null,
      nextCheckAt: null,
      checkCount: 0,
      successCount: 0,
      uptime: s.uptime ?? 100
    }))
  )
  const [events, setEvents] = useState([])

  const liveServicesRef     = useRef(liveServices)
  liveServicesRef.current   = liveServices
  const onStatusChangeRef   = useRef(onStatusChange)
  onStatusChangeRef.current = onStatusChange
  const infoRef   = useRef({})
  const timersRef = useRef({})

  useEffect(() => {
    liveServices.forEach(s => {
      infoRef.current[s.id] = { url: s.url, name: s.name }
    })
  }, [liveServices])

  const performCheck = useCallback(async (serviceId) => {
    const info = infoRef.current[serviceId]
    if (!info) return

    const prev       = liveServicesRef.current.find(s => s.id === serviceId)
    const prevStatus = prev?.status

    setLiveServices(curr =>
      curr.map(s => s.id === serviceId ? { ...s, isChecking: true } : s)
    )

    const result = await checkUrl(info.url)
    const now    = Date.now()

    setLiveServices(curr =>
      curr.map(s => {
        if (s.id !== serviceId) return s
        const newCheckCount   = (s.checkCount   || 0) + 1
        const newSuccessCount = (s.successCount || 0) + (result.status === 'UP' ? 1 : 0)
        const realUptime      = parseFloat(((newSuccessCount / newCheckCount) * 100).toFixed(2))
        return {
          ...s,
          status:        result.status,
          responseTime:  result.status === 'UP' ? result.responseTime : 0,
          history:       [...(s.history || []), result.responseTime].slice(-MAX_HISTORY),
          isChecking:    false,
          lastCheckedAt: now,
          nextCheckAt:   now + CHECK_INTERVAL_MS,
          checkCount:    newCheckCount,
          successCount:  newSuccessCount,
          uptime:        realUptime
        }
      })
    )

    setEvents(curr => [{
      id:           `evt_${now}_${serviceId}`,
      serviceId,
      serviceName:  info.name,
      status:       result.status,
      responseTime: result.responseTime,
      timestamp:    now
    }, ...curr].slice(0, MAX_EVENTS))

    if (prevStatus !== undefined && prevStatus !== result.status) {
      onStatusChangeRef.current?.({ serviceId, serviceName: info.name, from: prevStatus, to: result.status })
    }
  }, [])

  useEffect(() => {
    initialServices.forEach((s, i) => {
      infoRef.current[s.id] = { url: s.url, name: s.name }
      const delay = i * 3000
      timersRef.current[`init_${s.id}`] = setTimeout(() => {
        performCheck(s.id)
        timersRef.current[s.id] = setInterval(() => performCheck(s.id), CHECK_INTERVAL_MS)
      }, delay)
    })
    return () => {
      Object.values(timersRef.current).forEach(t => { clearInterval(t); clearTimeout(t) })
      timersRef.current = {}
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const addAndMonitorService = useCallback((service) => {
    const enriched = {
      ...service, history: [], isChecking: false,
      lastCheckedAt: null, nextCheckAt: null,
      checkCount: 0, successCount: 0, uptime: 100
    }
    infoRef.current[service.id] = { url: service.url, name: service.name }
    setLiveServices(curr => [...curr, enriched])
    timersRef.current[`init_${service.id}`] = setTimeout(() => {
      performCheck(service.id)
      timersRef.current[service.id] = setInterval(() => performCheck(service.id), CHECK_INTERVAL_MS)
    }, 300)
  }, [performCheck])

  // Manually trigger an immediate re-check and reset its 30s interval
  const checkNow = useCallback((serviceId) => {
    if (timersRef.current[serviceId]) clearInterval(timersRef.current[serviceId])
    performCheck(serviceId)
    timersRef.current[serviceId] = setInterval(() => performCheck(serviceId), CHECK_INTERVAL_MS)
  }, [performCheck])

  // Stop polling and remove a service from the dashboard
  const removeService = useCallback((serviceId) => {
    clearInterval(timersRef.current[serviceId])
    clearTimeout(timersRef.current[`init_${serviceId}`])
    delete timersRef.current[serviceId]
    delete infoRef.current[serviceId]
    setLiveServices(curr => curr.filter(s => s.id !== serviceId))
    setEvents(curr => curr.filter(e => e.serviceId !== serviceId))
  }, [])

  return { liveServices, events, addAndMonitorService, checkNow, removeService }
}
