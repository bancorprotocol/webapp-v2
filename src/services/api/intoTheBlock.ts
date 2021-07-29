import axios from 'axios';

const baseUrl = 'https://api.intotheblock.com';
const apiKey = 'i5Ns7HzXr9hIbPMfChi24ydoqQCdLBK2Rix0JwMg';

interface SignalsRes {
  summary: Summary;
}

interface Summary {
  bearish: number;
  bullish: number;
  neutral: number;
  score: number;
  thresholds: Thresholds;
}

interface Thresholds {
  bearish: number;
  bullish: number;
}

interface OverviewRes {
  concentration: number;
  inOutOfTheMoney: InOutOfTheMoney;
  byTimeHeldComposition?: ByTimeHeldComposition;
}

interface InOutOfTheMoney {
  in: number;
  between: number;
  out: number;
}

interface ByTimeHeldComposition {
  hodler: number;
  cruiser: number;
  trader: number;
}

export interface IntoTheBlock {
  summary: Summary;
  inOutOfTheMoney: InOutOfTheMoney;
  concentration: number;
  byTimeHeldComposition?: ByTimeHeldComposition;
  symbol: string;
}

axios.defaults.headers.common = {
  'x-api-key': apiKey,
};

const calculateTimeHeld = (timeHeld: ByTimeHeldComposition) => {
  const sumTimeHeld = timeHeld.hodler + timeHeld.cruiser + timeHeld.trader;
  const byTimeHeldComposition = {
    hodler: timeHeld.hodler / sumTimeHeld,
    cruiser: timeHeld.cruiser / sumTimeHeld,
    trader: timeHeld.trader / sumTimeHeld,
  };
  return byTimeHeldComposition;
};

export const intoTheBlockByToken = async (
  symbol: string
): Promise<IntoTheBlock | undefined> => {
  try {
    const [signal, overview] = await Promise.all([
      axios.get<SignalsRes>(`${baseUrl}/${symbol}/signals`),
      axios.get<OverviewRes>(`${baseUrl}/${symbol}/overview`),
    ]);
    const inOut = overview.data.inOutOfTheMoney;
    const timeHeld = overview.data.byTimeHeldComposition;

    const byTimeHeldComposition = timeHeld && calculateTimeHeld(timeHeld);

    const sumInOut = inOut.in + inOut.between + inOut.out;
    return {
      summary: signal.data.summary,
      symbol,
      inOutOfTheMoney: {
        in: inOut.in / sumInOut,
        between: inOut.between / sumInOut,
        out: inOut.out / sumInOut,
      },
      concentration: overview.data.concentration,
      ...(byTimeHeldComposition && { byTimeHeldComposition }),
    };
  } catch (error) {
    console.error(error);
  }
};
