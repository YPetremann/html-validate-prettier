import { HtmlValidate } from "html-validate";
import "html-validate/jest";
import Plugin from "..";
import {join} from "path"

jest.mock("html-validate-prettier", () => Plugin, { virtual: true });

describe("prettier/prettier", () => {
	let htmlvalidate: HtmlValidate;

	beforeAll(() => {
		htmlvalidate = new HtmlValidate({
			plugins: ["html-validate-prettier"],
			rules: { "prettier/prettier": "error" },
		});
	});

	it("should not report error when already prett", () => {
		expect.assertions(1);
		const report = htmlvalidate.validateFile(join(__dirname, "prettier.spec/formated.html"))
		expect(report).toBeValid();
	});

	it("should report error when containing html with missing tags", () => {
		expect.assertions(2);
		const report = htmlvalidate.validateFile(join(__dirname, "prettier.spec/badsyntax.html"))
		expect(report).toBeInvalid();
		expect(report).toHaveErrors([
			[
				"element-required-content",
				 "<html> element must have <body> as content"
			],
			[
				"prettier/prettier",
				"Parsing error: Unexpected closing tag \"body\". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags"
			],
			[
				"close-order",
				"Mismatched close-tag, expected '</html>' but found '</body>'."
			],
			[
				"close-order",
				"Unexpected close-tag, expected opening tag."
			]
		])
	});

	it("should report error when containing unformated html", () => {
		expect.assertions(2);
		const report = htmlvalidate.validateFile(join(__dirname, "prettier.spec/unformated.html"))
		expect(report).toBeInvalid();
		expect(report).toHaveError("prettier/prettier", 'Insert \"··\"');
	});
});
