import { expect, type Locator, type Page } from "@playwright/test";

const SAMPLE_RATE = 44_100;
const SILENT_SAMPLE = 0;

const createSilentWavBuffer = (durationMs = 1500): Buffer => {
  const sampleCount = Math.max(1, Math.floor((SAMPLE_RATE * durationMs) / 1000));
  const dataSize = sampleCount * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let index = 0; index < sampleCount; index += 1) {
    buffer.writeInt16LE(SILENT_SAMPLE, 44 + index * 2);
  }

  return buffer;
};

export const gotoApp = async (page: Page): Promise<void> => {
  await page.goto("/");
  await expect(page.getByTestId("top-menu")).toBeVisible();
};

export const addPad = async (page: Page, label: string): Promise<void> => {
  await page.getByTestId("open-add-pad-modal").click();
  await expect(page.getByTestId("add-pad-modal")).toBeVisible();

  await page.getByTestId("pad-audio-file-input").setInputFiles({
    name: "sample.wav",
    mimeType: "audio/wav",
    buffer: createSilentWavBuffer(),
  });

  await page.getByTestId("pad-label-input").fill(label);
  await page.getByTestId("submit-add-pad").click();

  await expect(getPadButton(page, label)).toBeVisible();
};

export const getPadButton = (page: Page, label: string): Locator =>
  page.getByTestId("sound-pad-button").filter({ hasText: label }).first();

export const getPadCard = (page: Page, label: string): Locator =>
  page
    .getByTestId("sound-pad")
    .filter({ has: page.getByTestId("sound-pad-button").filter({ hasText: label }) })
    .first();

export const getSortablePad = (page: Page, label: string): Locator =>
  page
    .getByTestId("sortable-pad")
    .filter({ has: page.getByTestId("sound-pad-button").filter({ hasText: label }) })
    .first();

export const acceptNextDialog = (page: Page): void => {
  page.once("dialog", (dialog) => dialog.accept());
};

export const deletePad = async (page: Page, label: string): Promise<void> => {
  const deleteModeButton = page.getByTestId("delete-mode-button");

  if ((await deleteModeButton.getAttribute("aria-pressed")) !== "true") {
    await deleteModeButton.click();
  }

  acceptNextDialog(page);
  await getPadButton(page, label).click({ force: true });
  await expect(getPadButton(page, label)).toHaveCount(0);
};

export const expectPadLabels = async (
  page: Page,
  labels: string[],
): Promise<void> => {
  await expect(page.getByTestId("sound-pad-button")).toHaveText(labels);
};

export const dragPadToPad = async (
  page: Page,
  source: Locator,
  target: Locator,
): Promise<void> => {
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error("Could not determine drag target bounds");
  }

  await page.mouse.move(
    sourceBox.x + sourceBox.width / 2,
    sourceBox.y + sourceBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    targetBox.x + targetBox.width / 2,
    targetBox.y + targetBox.height / 2,
    { steps: 20 },
  );
  await page.mouse.up();
};
