import { Plugin } from 'html-validate';
import configs from './configs/index';
import rules from './rules/index';
import versionCheck from './version-check';

versionCheck();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name } = require('../package.json');

const plugin: Plugin = {
  name,
  configs,
  rules,
};
export = plugin;
