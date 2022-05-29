import { ethers } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { useWeb3Store } from "~/stores/web3Store";
import { } from 'vue-connect-wallet'

export async function addTransaction(hash: string) {

    const { addTransaction, removeTransaction } = useWeb3Store()
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum)

    addTransaction(hash)
    web3Provider.waitForTransaction(hash, 1).then(() => {
        removeTransaction(hash)
    })

}
