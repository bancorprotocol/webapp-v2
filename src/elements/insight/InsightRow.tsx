import { pick, toPairs } from 'lodash';
import { prettifyNumber } from 'utils/helperFunctions';
import { InsightToken } from './Insight';
import { Needle } from './Needle';

enum Colour {
  Green,
  Grey,
  Red,
  Blue,
}

interface Progress {
  colour: Colour;
  decPercent: number;
}

const matchColour = (colour: Colour): string => {
  switch (colour) {
    case Colour.Blue:
      return 'primary';
    case Colour.Green:
      return 'green-500';
    case Colour.Grey:
      return 'gray-3';
    case Colour.Red:
      return 'red-500';
    default:
      throw new Error('Unable to match colour');
  }
};

export const InsightRow = ({ token }: { token: InsightToken }) => {
  const remainingConcentration = 1 - token.concentration;

  const cards: { label: string; percentages: Progress[] }[] = [
    ...(token.inOutOfTheMoney
      ? [
          {
            label: 'Holders making money at the current price',
            percentages: [
              { colour: Colour.Green, decPercent: token.inOutOfTheMoney.in },
              {
                colour: Colour.Grey,
                decPercent: token.inOutOfTheMoney.between,
              },
              { colour: Colour.Red, decPercent: token.inOutOfTheMoney.out },
            ],
          },
        ]
      : [{ label: 'No available insights', percentages: [] }]),
    {
      label: 'Concentration by large holders',
      percentages: [
        { colour: Colour.Blue, decPercent: token.concentration },
        { colour: Colour.Grey, decPercent: remainingConcentration },
      ],
    },
    ...(token.byTimeHeldComposition
      ? [
          {
            label: 'Holders composition by time held',
            percentages: [
              {
                colour: Colour.Blue,
                decPercent: token.byTimeHeldComposition.cruiser,
              },
              {
                colour: Colour.Red,
                decPercent: token.byTimeHeldComposition.trader,
              },
              {
                colour: Colour.Green,
                decPercent: token.byTimeHeldComposition.hodler,
              },
            ],
          },
        ]
      : [
          {
            label: 'No available insights',
            percentages: [],
          },
        ]),
  ];

  const rows = cards.map((colour) => ({
    content: colour.label,
    parsedPercentages: colour.percentages.map((percent) => ({
      formattedPercent: (percent.decPercent * 100).toFixed(1) + '%',
      colour: matchColour(percent.colour),
    })),
  }));

  const winning = toPairs(
    pick(token.summary, ['bullish', 'bearish', 'neutral'])
  ).sort(([, a], [, b]) => Number(b) - Number(a))[0];

  const title = (winning[0] as string).toUpperCase();

  const needlePercent = token.summary.score;

  const rotation = needlePercent * 180;

  const titleColour =
    rotation > 110
      ? 'text-green-500'
      : rotation > 70
      ? 'text-grey-3'
      : 'text-error';

  console.log(cards);

  return (
    <div className="grid grid-cols-9 justify-between py-24 px-4 gap-x-40 border-t">
      <div className="col-span-9 md:col-span-3 ">
        <div className="">
          <Needle percent={needlePercent} />
        </div>
        <div className={`${titleColour} text-center font-semibold text-lg`}>
          {title}
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded "></div>
        <div className="flex px-5 justify-between text-center">
          <div>
            <div className="font-bold text-2xl sm:text-3xl md:text-base text-error">
              {token.summary.bearish}
            </div>
            <div className=" text-2xl sm:text-3xl md:text-base">Bearish</div>
          </div>
          <div>
            <div className="font-bold text-2xl sm:text-3xl md:text-base text-gray-500">
              {token.summary.neutral}
            </div>
            <div className=" text-2xl sm:text-3xl md:text-base">Neutral</div>
          </div>
          <div>
            <div className="font-bold text-2xl sm:text-3xl md:text-base text-green-500 ">
              {token.summary.bullish}
            </div>
            <div className=" text-2xl sm:text-3xl md:text-base">Bullish</div>
          </div>
        </div>
      </div>
      <div className="col-span-9 md:col-span-6 grid grid-cols-3">
        <div className="flex invisible p-10 md:visible col-span-6">
          <div className="ml-6 mr-10">
            <img
              className="rounded-full h-32 w-32 shadow-sm bg-grey-2"
              src={token.image}
              alt="Token Logo"
            />
          </div>
          <div className="text-2xl bold  text-center">{token.symbol}</div>
          <div className="mx-12 text-xl pt-6  text-center">
            Price {prettifyNumber(token.price, true)}
          </div>
        </div>
        <div className="h-full col-span-3 gap-8 grid grid-cols-3">
          {rows.map((card) => (
            <div
              key={card.content}
              className="md:border rounded-15 p-8 h-full font-medium border-gray-200 col-span-3 md:col-span-1 flex flex-col justify-between"
            >
              <div className="text-sm text-center md:text-left">
                {card.content}
              </div>
              <div className="relative pt-1 ">
                <div className="flex mb-2 items-center justify-between">
                  {card.parsedPercentages.map((card) => (
                    <div key={card.colour} className="text-right">
                      <span
                        className={`text-xs  inline-block text-${card.colour}`}
                      >
                        {card.formattedPercent}
                      </span>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="overflow-hidden h-5 mb-4 text-xs flex rounded text-blue-4 bg-grey-3">
                    {card.parsedPercentages.map((card, index) => (
                      <div
                        key={index}
                        style={{ width: card.formattedPercent }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-${card.colour}`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
