/* eslint-disable no-unused-vars */
import axios from "./axios";
import qs from "qs";

export function generateParams(name, array) {
  let result = "";
  if (array != null && array.length > 0) {
    for (let idx = 0; idx < array.length; idx++) {
      result += `${name}=${array[idx]}&`;
    }
  }
  console.log(result);
  return result;
}
// SERVER

export async function gasPrice(chainId) {
  const gasPrice = await axios.get(`/gas-price?chainId=${chainId}`);
  console.log(gasPrice.data);
  return gasPrice.data;
}

export async function getSupportedChains() {
  const chains = await axios.get(`/supported/chains`);
  console.log(chains.data);
  return chains.data;
}

export async function getNotifications() {
  const notifications = await axios.get(`/notifications`);
  console.log(notifications.data);
  return notifications.data;
}

export async function getBuildTx(
  data = {
    sender: null,
    recipient: null,
    routePath: null,
    fromChainId: null,
    toChainId: null,
    fromTokenAddress: null,
    toTokenAddress: null,
    fromAmount: null,
    toAmount: null,
    bridgeInputTokenAddress: null,
  }
) {
  try {
    const quote = await axios.get(`/build-tx`, {
      params: {
        sender: data.sender,
        recipient: data.recipient,
        routePath: data.routePath,
        fromChainId: data.fromChainId,
        toChainId: data.toChainId,
        fromTokenAddress: data.fromTokenAddress,
        toTokenAddress: data.toTokenAddress,
        fromAmount: data.fromAmount,
        toAmount: data.toAmount,
        bridgeInputTokenAddress: data.bridgeInputTokenAddress,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params);
      },
    });
    return quote.data;
  } catch (error) {
    console.log(error);
  }
}

export async function postBuildTx(data) {
  return await axios.post('/build-tx', data);
}
// BALANCES

export async function getbalances(userAddress) {
  const balances = await axios.get(`/balances?userAddress=${userAddress}`);
  console.log(balances.data);
  return balances.data;
}
export async function debank(userAddress) {
  const balances = await axios.get(
    `/balances/debank?userAddress=${userAddress}`
  );
  console.log(balances.data);
  return balances.data;
}

export async function getTokenBalance(tokenAddress, chainId, userAddress) {
  const tokenBalance = await axios.get(
    `/balances/token-balance?tokenAddress=${tokenAddress}&chainId=${chainId}&userAddress=${userAddress}`
  );
  console.log(tokenBalance.data);
  return tokenBalance.data;
}

// TOKEN LISTS
export async function toTokenList(
  data = {
    fromChainId: null,
    toChainId: null,
    disableSwapping: null,
    includeDexes: null,
    excludeDexes: null,
    includeBridges: null,
    excludeBridges: null,
    singleTxOnly: null,
    isShortList: null,
  }
) {
  try {
    const tokenBalance = await axios.get(`/token-lists/to-token-list`, {
      params: {
        fromChainId: data.fromChainId,
        toChainId: data.toChainId,
        disableSwapping: data.disableSwapping,
        includeDexes: data.includeDexes,
        excludeDexes: data.excludeDexes,
        includeBridges: data.includeBridges,
        excludeBridges: data.excludeBridges,
        singleTxOnly: data.singleTxOnly,
        isShortList: data.isShortList,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params);
      },
    });
    console.log(tokenBalance.data);
    return tokenBalance.data;
  } catch (error) {
    console.log(error);
  }
}

export async function fromTokenList(
  data = {
    fromChainId: null,
    toChainId: null,
    disableSwapping: null,
    includeDexes: null,
    excludeDexes: null,
    includeBridges: null,
    excludeBridges: null,
    singleTxOnly: null,
    isShortList: null,
  }
) {
  try {
    const fromTokenList = await axios.get(`/token-lists/from-token-list`, {
      params: {
        fromChainId: data.fromChainId,
        toChainId: data.toChainId,
        disableSwapping: data.disableSwapping,
        includeDexes: data.includeDexes,
        excludeDexes: data.excludeDexes,
        includeBridges: data.includeBridges,
        excludeBridges: data.excludeBridges,
        singleTxOnly: data.singleTxOnly,
        isShortList: data.isShortList,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params);
      },
    });
    console.log(fromTokenList.data);
    return fromTokenList.data;
  } catch (error) {
    console.log(error);
  }
}

// QUOTE
export async function quote(
  data = {
    fromChainId: null,
    fromTokenAddress: null,
    toChainId: null,
    toTokenAddress: null,
    fromAmount: null,
    userAddress: null,
    recipient: null,
    uniqueRoutesPerBridge: null,
    sort: null,
    disableSwapping: null,
    includeDexes: null,
    excludeDexes: null,
    includeBridges: null,
    excludeBridges: null,
    singleTxOnly: null,
    maxUserTxs: null,
    isContractCall: null,
  }
) {
  try {
    const quote = await axios.get(`/quote`, {
      params: {
        fromChainId: data.fromChainId,
        fromTokenAddress: data.fromTokenAddress,
        toChainId: data.toChainId,
        toTokenAddress: data.toTokenAddress,
        fromAmount: data.fromAmount,
        userAddress: data.userAddress,
        recipient: data.recipient,
        uniqueRoutesPerBridge: data.uniqueRoutesPerBridge,
        sort: data.sort,
        disableSwapping: data.disableSwapping,
        includeDexes: data.includeDexes,
        excludeDexes: data.excludeDexes,
        includeBridges: data.includeBridges,
        excludeBridges: data.excludeBridges,
        singleTxOnly: data.singleTxOnly,
        maxUserTxs: data.maxUserTxs,
        isContractCall: data.isContractCall,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params);
      },
    });
    return quote.data;
  } catch (error) {
    console.log(error);
  }
}
