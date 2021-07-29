export const Needle = ({ percent }: { percent: number }) => {
  const rotation = percent * 180;

  const gradientColour =
    rotation > 110 ? 'palegreen' : rotation > 70 ? 'grey' : 'red';

  return (
    <svg viewBox="0 0 68 41">
      <circle
        cx="34"
        cy="34"
        r="31.8"
        fill="none"
        stroke="red"
        strokeWidth="1"
        strokeDasharray="39.5 200"
        strokeDashoffset="-98"
        strokeLinecap="round"
      />
      <circle
        cx="34"
        cy="34"
        r="31.8"
        fill="none"
        stroke="lightgray"
        strokeWidth="1"
        strokeDasharray="20 200"
        strokeDashoffset="-140"
        strokeLinecap="round"
      />
      <circle
        cx="34"
        cy="34"
        r="31.8"
        fill="none"
        stroke="green"
        strokeWidth="1"
        strokeDasharray="39 200"
        strokeDashoffset="-98"
        strokeLinecap="round"
        transform="scale(-1 1)"
        transform-origin="34 34"
      />
      <circle cx="34" cy="34" r="30" fill="url(#meter-bg)" />
      <line
        x1="6"
        y1="34"
        x2="34"
        y2="34"
        stroke="black"
        strokeWidth="0.5"
        strokeLinecap="round"
        transform={`rotate(${rotation})`}
        transform-origin="34 34"
      />
      <circle
        cx="34"
        cy="34"
        r="1.5"
        fill="white"
        stroke="black"
        strokeWidth="0.5"
      />

      <defs>
        <linearGradient id="meter-bg" gradientTransform="rotate(90)">
          <stop offset="0%" stopColor={gradientColour} stopOpacity="90%" />
          <stop offset="55%" stopColor="white" stopOpacity="0%" />
        </linearGradient>
      </defs>
    </svg>
  );
};
