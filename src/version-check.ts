import { version as HtmlValidateVersion } from 'html-validate';
import semver from 'semver';

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const pkg = require('../package.json');

/**
 * sanity check: html-validate version should satisfy peerDependecy or a warning
 * will be printed.
 *
 * @param peerDependency - What library versions does this library support
 * @param version - What is the current version of html-validate
 */
export function doVersionCheck(peerDependency: string, version?: string): void {
  const printVersion = version || '< 1.16.0';
  if (!semver.satisfies(version || '0.0.0', peerDependency)) {
    /* eslint-disable-next-line no-console */
    console.error(
      [
        '-----------------------------------------------------------------------------------------------------',
        `${pkg.name} requires html-validate version "${peerDependency}" but current installed version is ${printVersion}`,
        'This is not a supported configuration. Please install a supported version before reporting bugs.',
        '-----------------------------------------------------------------------------------------------------',
      ].join('\n')
    );
  }
}

export default function versionCheck(): void {
  const version = HtmlValidateVersion;
  const peerDependency = pkg.peerDependencies['html-validate'];
  doVersionCheck(peerDependency, version);
}
