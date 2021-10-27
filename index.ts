import './style.css';

import {
  map,
  animationFrames,
  takeWhile,
  endWith,
  OperatorFunction,
  pipe,
} from 'rxjs';

function asFractionsOfDuration(
  duration: number
): OperatorFunction<{ elapsed: number }, number> {
  return pipe(
    map(({ elapsed }) => elapsed / duration),
    takeWhile((t) => t < 1),
    endWith(1)
  );
}

function toSpiralCoordinates({
  revolutions,
  incrementRadiusBy,
  cx,
  cy,
}: {
  revolutions: number;
  incrementRadiusBy: number;
  cx: number;
  cy: number;
}) {
  const revolutionVector = 2 * revolutions * Math.PI;
  return map((r: number) => {
    const radius = r * incrementRadiusBy;
    return {
      x: radius * Math.sin(r * revolutionVector) + cx,
      y: radius * Math.cos(r * revolutionVector) + cy,
      progress: r,
    };
  });
}
const el = document.getElementById('root');
animationFrames()
  .pipe(
    asFractionsOfDuration(5000),
    toSpiralCoordinates({
      revolutions: 4,
      incrementRadiusBy: 100,
      cy: 100,
      cx: 100,
    })
  )
  .subscribe(({ x, y, progress }) => {
    el.classList.add('spiral-dot');
    const rainbowColor = `hsl(${360 * progress}, 80%, 50%)`;
    el.setAttribute(
      'style',
      `background: ${rainbowColor}; position: absolute; top: 0; left: 0; transform: translate3d(${x}px, ${y}px, 0); width: 5px; height: 5px; border-radius: 50%`
    );
    // document.body.appendChild(el);
  });
