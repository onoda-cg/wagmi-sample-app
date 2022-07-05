import '../styles/globals.css'
import type { AppProps } from 'next/app'

import {
  WagmiConfig,
  createClient,
  defaultChains,
  chain,
  configureChains,
} from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

const alchemyId = process.env.ALCHEMY_API_KEY

const { chains, provider, webSocketProvider } = configureChains([chain.polygonMumbai, ...defaultChains] , [
  alchemyProvider({ alchemyId }),
  publicProvider(),
])

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({chains}),
  ],
  provider,
  webSocketProvider,
})


function MyApp({ Component, pageProps }: AppProps) {
  return <WagmiConfig client={client}><Component {...pageProps} /></WagmiConfig>
}

export default MyApp
