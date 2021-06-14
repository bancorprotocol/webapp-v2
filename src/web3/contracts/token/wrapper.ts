export const balanceFetcher = async (
  userAddress: string,
  addresses: string[]
): Promise<{ address: string; weiBalance: string }[]> => {
  return addresses.map((address) => ({ weiBalance: '4332423', address }));
};
