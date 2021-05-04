import fs from "fs";
import { DOMReadyEvent, Rule, RuleDocumentation } from "html-validate";
import lc from "line-column";
import prettier from "prettier";
import { generateDifferences, showInvisibles } from 'prettier-linter-helpers';
const {INSERT, DELETE, REPLACE} = generateDifferences;

type PrettierErrorLoc = {
  start: {
    line: number,
    column: number
  }
  end: {
    line: number,
    column: number
  }
}

type HVLoc = {
  filename: string,
  line: number,
  column: number,
  offset: number,
  size: number
}
type Diff = {
  offset: number,
  operation: string,
  deleteText?: string,
  insertText?: string,
}
function getLocFromPrettierSyntaxError(source: string, lcf: any, filename: string, errloc: PrettierErrorLoc): HVLoc {
  const { line, column } = errloc.start
  const offset = lcf.toIndex(line, column)
  const size = lcf.toIndex(errloc.end.line, errloc.end.column) - offset
  return {
    filename,
    line,
    column,
    offset,
    size,
  };
}
function getLocFromDifference(source: string, lcf: any, filename: string, diff: Diff): HVLoc {
  const size = diff?.deleteText?.length || 0
  const offset = diff.offset < 0 ? 0 : diff.offset > source.length - 1 ? source.length - 1 : diff.offset;
  const { line, col: column } = lcf.fromIndex(offset)
  return {
    filename,
    line,
    column,
    offset,
    size
  };
}

export class Prettier extends Rule {
  public documentation(): RuleDocumentation {
    return {
      description: "Prettier.",
    };
  }

  public setup(): void {
    const messages = {
      insert: (code: string) => `Insert "${showInvisibles(code)}"`,
      delete: (code: string) => `Delete "${showInvisibles(code)}"`,
      replace: (deleteCode: string, insertCode: string) =>
        `Replace "${showInvisibles(deleteCode)}" with "${showInvisibles(
          insertCode
        )}"`,
    };
    
    this.on("dom:ready", (event: DOMReadyEvent) => {
      // Default to '<input>' if a filepath was not provided.
      // This mimics eslint's behaviour
      const filename = event.document.root.location.filename || '<input>';
      const source = fs.readFileSync(filename, { encoding: 'utf8', flag: "r" });
      const lcf = lc(source)
 
      const prettierRcOptions =
        prettier.resolveConfig && prettier.resolveConfig.sync
          ? prettier.resolveConfig.sync(filename, {editorconfig: true})
          : null;
            //prettier.getFileInfo was added in v1.13
      const prettierFileInfo =
        prettier.getFileInfo && prettier.getFileInfo.sync
          ? prettier.getFileInfo.sync(filename, {
              resolveConfig: true,
              ignorePath: '.prettierignore',
            })
          : {ignored: false, inferredParser: null};

      // Skip if file is ignored using a .prettierignore file
      if (prettierFileInfo.ignored) return;
      
      const initialOptions:any = {};
      if (filename == '<input>') {
        initialOptions.parser = 'html';
      }
      const prettierOptions = Object.assign(
        {},
        initialOptions,
        prettierRcOptions,
        {filepath: filename}
      );
      let prettierSource = null
      try {
        prettierSource = prettier.format(source, prettierOptions)
      } catch (err) {
        if (!(err instanceof SyntaxError)) {
          throw err;
        }
        const err2 = err as any
        let message = 'Parsing error: ' + err.message;

        // Prettier's message contains a codeframe style preview of the
        // invalid code and the line/column at which the error occurred.
        // ESLint shows those pieces of information elsewhere already so
        // remove them from the message
        if (err2.codeFrame) {
          message = message.replace(`\n${err2.codeFrame}`, '');
        }
        if (err2.loc) {
          message = message.replace(/ \(\d+:\d+\)$/, '');
        }
        const location = getLocFromPrettierSyntaxError(source, lcf, filename, err2.loc)
        this.report(event.document.root,message, location)
        return;

      }
      if (source === prettierSource) {
        return;
      }
      const differences = generateDifferences(source, prettierSource);
      differences.forEach((difference) => {
        const location = getLocFromDifference(source, lcf, filename, difference)
        switch (difference.operation) {
          case INSERT:
            this.report(
              null,
              messages.insert(difference.insertText!), location);
            break;
          case DELETE:
            this.report(
              null,
              messages.delete(difference.deleteText!), location);
            break;
          case REPLACE:
            this.report(
              null,
              messages.replace(difference.deleteText!, difference.insertText!),
              location
            );
            break;
        }
      });
    });
  }
}
