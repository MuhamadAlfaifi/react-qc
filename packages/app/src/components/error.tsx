import type { MouseEventHandler } from 'react';

export function Error(props: { error: Error, onClick?: MouseEventHandler<HTMLButtonElement> }) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-red-600">
        <p>
          Error: {props.error.message}
        </p>
      </div>
      <button onClick={props.onClick}>retry</button>
    </div>
  );
}