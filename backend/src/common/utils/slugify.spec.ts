import { slugify } from './slugify';

describe('slugify', () => {
  it('normalizes basic names', () => {
    expect(slugify('Silk Bob Wig')).toBe('silk-bob-wig');
  });

  it('strips apostrophes and accents', () => {
    expect(slugify("Women's Café Wig")).toBe('womens-cafe-wig');
  });

  it('never returns an empty slug', () => {
    expect(slugify('!!!')).toBe('product');
    expect(slugify('   ')).toBe('product');
  });
});
