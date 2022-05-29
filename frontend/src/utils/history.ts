import { ref } from "vue";

/* eslint-disable camelcase */
const history = ref([] as any[]);

export function loadHistory() {
  for (let i = 0; i < window.localStorage.length; i++) {
    if (window.localStorage.key(i)?.startsWith("history")) {
      const json = window.localStorage.getItem(window.localStorage.key(i)!);
      const prev_transaction = JSON.parse(json!);
      // console.log(prev_transaction.fromToken._value.name)
      history.value.push(prev_transaction)!;
    }
  }
}

export function addToHistory(data: {
  name: any;
  hash: any;
  fromChain: any;
  toChain: any;
  fromToken: any;
  toToken: any;
  value: any;
  time: any;
}) {
  const jsonuwu = JSON.stringify({
    name: data.name,
    hash: data.hash,
    fromChain: data.fromChain,
    toChain: data.toChain,
    fromToken: data.fromToken,
    toToken: data.toToken,
    value: data.value,
    time: +new Date(),
  });
  window.localStorage[`history_${data.hash}`] = jsonuwu;
}
