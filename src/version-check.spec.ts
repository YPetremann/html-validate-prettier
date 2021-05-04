import { doVersionCheck } from "./version-check";

const log = jest.spyOn(console, "error");
const peerDependency = ">= 2.1 || ^3.0";

beforeEach(() => {
	log.mockReset();
});

it("should warn when using unsupported html-validate version", () => {
	expect.assertions(2);
	doVersionCheck(peerDependency, "1.2.3");
	expect(log).toHaveBeenCalled();
	expect(log.mock.calls[0][0]).toMatchInlineSnapshot(`
		"-----------------------------------------------------------------------------------------------------
		html-validate-vue requires html-validate version \\">= 2.1 || ^3.0\\" but current installed version is 1.2.3
		This is not a supported configuration. Please install a supported version before reporting bugs.
		-----------------------------------------------------------------------------------------------------"
	`);
});

it("should warn when using html-validate without exposed version (pre 1.16)", () => {
	expect.assertions(2);
	doVersionCheck(peerDependency);
	expect(log).toHaveBeenCalled();
	expect(log.mock.calls[0][0]).toMatchInlineSnapshot(`
		"-----------------------------------------------------------------------------------------------------
		html-validate-vue requires html-validate version \\">= 2.1 || ^3.0\\" but current installed version is < 1.16.0
		This is not a supported configuration. Please install a supported version before reporting bugs.
		-----------------------------------------------------------------------------------------------------"
	`);
});

it("should not warn when using supported html-validate version", () => {
	expect.assertions(1);
	doVersionCheck(peerDependency, "2.1.0");
	doVersionCheck(peerDependency, "2.2.0");
	doVersionCheck(peerDependency, "3.0.0");
	expect(log).not.toHaveBeenCalled();
});
