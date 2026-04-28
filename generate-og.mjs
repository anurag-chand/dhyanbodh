import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const inputDir = path.join(process.cwd(), "content/_resources");
const outputDir = path.join(process.cwd(), "quartz/static/images");

async function main() {
  try {
    await fs.mkdir(outputDir, { recursive: true });

    const allSourceFiles = await fs.readdir(inputDir);
    const imageFiles = allSourceFiles.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
    
    // 1. Generate expected output filenames
    const expectedOutputs = new Set(imageFiles.map(file => `${path.parse(file).name}-og.jpg`));

    // 2. Cleanup orphaned files (if you renamed or deleted an image in _resources)
    const existingOutputs = await fs.readdir(outputDir);
    const orphanedFiles = existingOutputs.filter(file => file.endsWith("-og.jpg") && !expectedOutputs.has(file));

    for (const orphan of orphanedFiles) {
      await fs.unlink(path.join(outputDir, orphan));
      console.log(`🗑️ Removed old/renamed OG image: ${orphan}`);
    }

    console.log(`🚀 Processing ${imageFiles.length} images...`);

    const results = await Promise.all(imageFiles.map(async (file) => {
      const inputPath = path.join(inputDir, file);
      const outputFileName = `${path.parse(file).name}-og.jpg`;
      const outputPath = path.join(outputDir, outputFileName);

      try {
        try {
          const [inputStat, outputStat] = await Promise.all([
            fs.stat(inputPath),
            fs.stat(outputPath)
          ]);
          if (outputStat.mtime >= inputStat.mtime) return { file, status: "skipped" };
        } catch {}

        await sharp(inputPath)
          .resize(1200, 630, { fit: "cover", position: "entropy" })
          .jpeg({ quality: 80 })
          .toFile(outputPath);

        return { file, status: "created" };
      } catch (err) {
        return { file, status: "error", error: err.message };
      }
    }));

    const created = results.filter(r => r.status === "created");
    const skipped = results.filter(r => r.status === "skipped");
    if (created.length > 0) console.log(`✅ Created ${created.length} new OG images.`);
    if (skipped.length > 0) console.log(`⏩ Skipped ${skipped.length} existing images.`);

  } catch (err) {
    console.error("Critical Error:", err.message);
    process.exit(1);
  }
}

main();
