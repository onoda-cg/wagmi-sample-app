import {
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi'
import { useIsMounted } from '../libs/utils'

export function Profile() {
  const isMounted = useIsMounted()
  const { address, connector, isConnected } = useAccount()
  const { connect, connectors, error } = useConnect()
  const { disconnect } = useDisconnect()

  if (isMounted && isConnected) {
    return (
      <div>
        <div>{address}</div>
        <div>Connected to {connector?.name}</div>
        <button onClick={() => {disconnect()}}>Disconnect</button>
      </div>
    )
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button
          disabled={!isMounted || !connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          Connect
        </button>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  )
}
