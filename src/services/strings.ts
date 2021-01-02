import slugify from 'slugify';

function slug(input: string): string {
  return slugify(input, { lower: true, strict: true });
}

export {
  slug,
};
