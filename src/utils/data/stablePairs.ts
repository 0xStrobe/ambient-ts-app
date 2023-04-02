// Arbitrary list of stable or stabl-ish USD pegged coins indexed by chain ID
const STABLE_TOKENS_BY_CHAIN = {
    '0x5': [
        '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60',
        '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
    ].map((x) => x.toLowerCase()),
};

// Only exist to satisfy the typescript compiler when we index, don't worry about
// not being comprehensive
type CHAIN_ID_TYPE = '0x5';

// @return true if the two tokens constitute a stable pair (USD based stables only for now)
//
// NOTE: Definition of what constitutes a "stable pair" is arbitrary and just based
//       on the devs discretion. Users should not assume that true/false implies
//       any sort of specific guaranteed relation between the tokens.
export function isStablePair(
    addr1: string,
    addr2: string,
    chain: string,
): boolean {
    return isStableToken(addr1, chain) && isStableToken(addr2, chain);
}

// @return true if the token represents a USD-based stablecoin
// NOTE: Decision of whether a token counts as stable or not is arbitrary and just at the
//       discretion of the app authors
export function isStableToken(addr: string, chain: string): boolean {
    if (!(chain in STABLE_TOKENS_BY_CHAIN)) {
        return false;
    }

    return STABLE_TOKENS_BY_CHAIN[chain as CHAIN_ID_TYPE]
        .map((x) => x.toLowerCase())
        .includes(addr.toLowerCase());
}
