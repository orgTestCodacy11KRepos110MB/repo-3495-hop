import { useQuery } from 'react-query'
import { ChainId, Token } from '@hop-protocol/sdk'
import { Addressish } from 'src/models/Address'
import { StakingRewards } from '@hop-protocol/core/contracts'
import { defaultRefetchInterval } from 'src/utils'

async function fetchBalance(token: Token | StakingRewards, address: string) {
  return await token.balanceOf(address)
}

export const useBalance = (
  token?: Token | StakingRewards,
  address?: Addressish,
  chainId?: ChainId
) => {
  chainId = token instanceof Token ? token.chain.chainId : chainId

  const queryKey = `balance:${chainId}:${token?.address}:${address?.toString()}`

  const { isLoading, isError, data, error } = useQuery(
    [queryKey, chainId, token?.address, address?.toString()],
    async () => {
      if (token && address) {
        return await fetchBalance(token, address.toString())
      }
    },
    {
      enabled: !!chainId && !!token && !!address,
      refetchInterval: defaultRefetchInterval,
    }
  )

  return { loading: isLoading, isError, balance: data, error }
}
