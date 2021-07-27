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
        stroke-width="1"
        stroke-dasharray="39.5 200"
        stroke-dashoffset="-98"
        stroke-linecap="round"
      />
      <circle
        cx="34"
        cy="34"
        r="31.8"
        fill="none"
        stroke="lightgray"
        stroke-width="1"
        stroke-dasharray="20 200"
        stroke-dashoffset="-140"
        stroke-linecap="round"
      />
      <circle
        cx="34"
        cy="34"
        r="31.8"
        fill="none"
        stroke="green"
        stroke-width="1"
        stroke-dasharray="39 200"
        stroke-dashoffset="-98"
        stroke-linecap="round"
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
        stroke-width="0.5"
        stroke-linecap="round"
        transform={`rotate(${rotation})`}
        transform-origin="34 34"
      />
      <circle
        cx="34"
        cy="34"
        r="1.5"
        fill="white"
        stroke="black"
        stroke-width="0.5"
      />

      <defs>
        <linearGradient id="meter-bg" gradientTransform="rotate(90)">
          <stop offset="0%" stop-color={gradientColour} stop-opacity="90%" />
          <stop offset="55%" stop-color="white" stop-opacity="0%" />
        </linearGradient>
      </defs>
    </svg>
  );
};
