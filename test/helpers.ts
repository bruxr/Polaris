import fs from 'fs';

export async function getFixture(name: string): Promise<string> {
  const contents = await fs.promises.readFile(`./test/fixtures/${name}.txt`, { encoding: 'utf8' });
  return contents.toString();
}
