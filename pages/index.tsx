import type { NextPage } from 'next'
import { useRef } from 'react'
import Head from 'next/head'
import { useContractRead, useContractWrite } from 'wagmi'
import ContractJson from "../artifacts/contracts/Greeter.sol/Greeter.json"
import { Profile } from '../components/profile'
import styles from '../styles/Home.module.css'
import { useIsMounted } from '../libs/utils'

const abi = ContractJson.abi;
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ""

const Home: NextPage = () => {
  const isMounted = useIsMounted()
  const inputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading, refetch } = useContractRead({
    addressOrName: contractAddress,
    contractInterface: abi,
    functionName: 'greet',
    watch: true,
  })

  const { isLoading: isWriteLoading, write } = useContractWrite({
    addressOrName: contractAddress,
    contractInterface: abi,
    functionName: 'setGreeting',
    args: inputRef.current?.value,
  })

  return (
    <div className={styles.container}>
      <Head>
        <title>Wagmi Library Sample</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Profile/>

        <hr/>

        <div>
          Contract Greeter's <code>greet()</code> result: {isMounted ? ( isLoading ? "(loading...)" : data ) : ""}
          <br/>
          <button type="button" onClick={async () => {await refetch()}}>refetch</button>
        </div>

        <hr/>

        <div>
          <form>
            <input type="text" placeholder="input text" ref={inputRef} />
            { isWriteLoading ? "(writing...)" :
            <button type="button" onClick={() => { write() }}>setGreeting</button>}
          </form>
        </div>

      </main>

    </div>
  )
}

export default Home
