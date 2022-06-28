import { TokenIF } from '../interfaces/exports';

import { kovanDAI, kovanUSDC, kovanETH } from '../data/defaultTokens';

const tempBackupTokens = [kovanDAI, kovanUSDC, kovanETH];

export const filterTokensByChain = (tkns: Array<TokenIF>, chain: number) => {
    const tokensOnChain = tkns.filter((tkn: TokenIF) => tkn.chainId === chain);
    return tokensOnChain;
};

export const getCurrentTokens = (chainId: string) => {
    const tokensInLocalStorage = localStorage.getItem('testTokens');
    const allTokens = tokensInLocalStorage ? JSON.parse(tokensInLocalStorage) : '';
    const tokensOnChain = filterTokensByChain(
        allTokens ? allTokens : tempBackupTokens,
        parseInt(chainId),
    );
    return tokensOnChain;
};

export const findTokenByAddress = (addr: string, tokens: Array<TokenIF>) => {
    const token = tokens.find((tkn: TokenIF) => tkn.address === addr);
    return token;
};