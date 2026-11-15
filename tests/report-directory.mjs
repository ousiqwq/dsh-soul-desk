import {mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';

/** Reports stay outside tracked source, including on a fresh checkout. */
export async function reportDirectory(scope) {
  const root=process.env.DSH_TEST_REPORTDIR??'test-results/native-host/reports';
  const directory=resolve(root,scope);
  await mkdir(directory,{recursive:true});
  return directory;
}
