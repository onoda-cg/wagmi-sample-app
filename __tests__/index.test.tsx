import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { allChains, chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { MockConnector } from "@wagmi/core/connectors/mock";
import Home from "../pages/index";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { ethers } from 'ethers';

const { provider } = configureChains(allChains,
  [
    jsonRpcProvider({rpc: () => ({http:"http://127.0.0.1:8545"})}),
  ]
)

const client = createClient({
  autoConnect: true,
  provider,
  connectors: [
    new MockConnector({options: {
      signer: new ethers.Wallet(
        process.env.PRIVATE_KEY || "",
        new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545")
      )
    }})
  ]
})

describe('Home', () => {
  it('initial render without error', () => {
    const result = render(<WagmiConfig client={client}><Home/></WagmiConfig>)
    expect(result).toBeTruthy()
  })

  it('render result', async () => {
    render(<WagmiConfig client={client}><Home/></WagmiConfig>)
    const resultNode = await screen.findByText(/Hello, Hardhat!/i, {}, {timeout:4000})
    expect(resultNode).toBeInTheDocument()
  })

  it('connect button', async () => {
    render(<WagmiConfig client={client}><Home/></WagmiConfig>)
    const connectButton = screen.getByText(/connect/i)
    fireEvent.click(connectButton)
    await screen.findByText(/disconnect/i, {}, {timeout:4000})
  })

  it('setGreeting button', async () => {
    render(<WagmiConfig client={client}><Home/></WagmiConfig>)

    const textInput = screen.getByPlaceholderText<HTMLInputElement>(/input text/i)
    fireEvent.change(textInput, {
      target: {value: "Hello, Wagmi!"}
    })
    const setGreetingButton = screen.getByText(/setGreeting/i)
    fireEvent.click(setGreetingButton)
    const writingNode = await screen.findByText(/writing.../i, {}, {timeout:4000})
    expect(writingNode).toBeInTheDocument()
  })

  it('setGreeting button result muse be Hello, Wagmi!', async () => {
    render(<WagmiConfig client={client}><Home/></WagmiConfig>)
    const resultNode = await screen.findByText(/Hello, Wagmi!/i, {}, {timeout:4000})
    expect(resultNode).toBeInTheDocument()
  })
})
