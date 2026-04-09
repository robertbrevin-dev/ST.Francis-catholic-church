import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"
import { Outlet, useLocation } from "react-router"

function RouteProgressBar() {
  const { pathname } = useLocation()
  const [tick, setTick] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    setTick((n) => n + 1)
  }, [pathname])

  if (reduce) return null

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[100] h-[3px] overflow-hidden"
      aria-hidden
    >
      <motion.div
        key={tick}
        className="h-full w-full origin-left rounded-none bg-gradient-to-r from-amber-600 via-amber-200 to-emerald-700 shadow-[0_0_12px_rgba(251,191,36,0.45)]"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: [1, 1, 0] }}
        transition={{
          scaleX: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.55, times: [0, 0.75, 1], ease: "easeOut" },
        }}
        style={{ transformOrigin: "0% 50%" }}
      />
    </div>
  )
}

export function AnimatedOutlet() {
  const { pathname } = useLocation()
  const reduce = useReducedMotion()

  const transition = reduce
    ? { duration: 0 }
    : { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const }

  const idle = { opacity: 1, y: 0, scale: 1 }
  const enter = reduce ? idle : { opacity: 0, y: 22, scale: 0.992 }
  const leave = reduce ? idle : { opacity: 0, y: -14, scale: 0.996 }

  return (
    <>
      <RouteProgressBar />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className="flex min-h-0 w-full min-w-0 flex-1 flex-col"
          initial={enter}
          animate={idle}
          exit={leave}
          transition={transition}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </>
  )
}
