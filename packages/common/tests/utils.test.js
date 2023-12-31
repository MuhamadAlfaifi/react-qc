import { errorRender } from '../src/utils';

describe('errorRender', () => {
  const error = <div>Test error</div>;
  const props = { resetErrorBoundary: () => {} };

  it('returns a function that returns the jsx error if it is not a function', () => {
    const fallback = errorRender(error);
    
    expect(fallback(props)).toBe(error);
  });

  it('returns the input error function if it is a function', () => {
    const fallback = errorRender(() => error);
    
    expect(fallback(props)).toBe(error);
  });
});