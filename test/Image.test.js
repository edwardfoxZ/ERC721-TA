const Image = artifacts.require("Image");
const { expectRevert } = require("@openzeppelin/test-helpers");

let image;

before(async () => {
  image = await Image.deployed();
});

it("contract name", async () => {
  const name = await image.name();
  const symbol = await image.symbol();

  assert.equal(name, "Image");
  assert.equal(symbol, "IMG");
});

it("minting", async () => {
  await image.mint("image1");
  const image1 = await image.Images(0);
  assert.equal(image1, "image1");
});

it("should not mint", async () => {
  await expectRevert(image.mint("image1"), "the image already exists");
});
