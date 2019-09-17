import { MarketState } from "./market.reducer";
import { bigNumberify } from "ethers/utils";

const rehydrateMarketData = (source) => {
  let md = source;

  md.totalMinted = (source.totalMinted) ? bigNumberify(source.totalMinted._hex.toString()) : bigNumberify(0);
  md.transactions = source.transactions.map(t => {
    let resultItem = t;
    for (const prop in t) {
      if (t[prop]._hex) {
        resultItem[prop] = bigNumberify(t[prop]._hex.toString())
      }
    }
    return resultItem;
  })
  for (const address in source.netContributions) {
    md.netContributions[address] = bigNumberify(source.netContributions[address]._hex.toString());;
  }
  for (const address in source.balances) {
    md.balances[address] = bigNumberify(source.balances[address]._hex.toString());
  }

  return md;
}

const rehydrateVaultData = (source) => {
  let vd = source;
  vd.totalRaised = source.totalRaised ? bigNumberify(source.totalRaised._hex.toString()) : bigNumberify(0);
  vd.phases = source.phases.map(p => {
    let resultItem = p;
    for (const prop in p) {
      if (p[prop]._hex) {
        resultItem[prop] = bigNumberify(p[prop]._hex.toString())
      }
    }

    return resultItem;
  })

  return vd;
}

export { rehydrateMarketData, rehydrateVaultData };