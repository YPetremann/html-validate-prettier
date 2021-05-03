import { Plugin } from "html-validate"
import configs from "./configs/index"
import rules from "./rules/index"
import * as pkg from "../package.json"

const name = "prettier" || pkg.name

const plugin:Plugin = {
  name,
  configs,
  rules,
}
export = plugin
