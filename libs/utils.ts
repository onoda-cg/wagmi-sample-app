import { useEffect, useState } from "react"

// https://github.com/tmm/wagmi/issues/28 より
export const useIsMounted = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

