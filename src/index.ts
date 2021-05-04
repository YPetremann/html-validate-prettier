import { Plugin } from "html-validate"
import configs from "./configs/index"
import rules from "./rules/index"

const name = "prettier"

const plugin:Plugin = {
  name,
  configs,
  rules,
}
export = plugin
