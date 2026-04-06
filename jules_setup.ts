import { $ } from "bun";

async function main() {
  console.log("Starting setup...");

  // Install dependencies
  console.log("Installing dependencies...");
  await $`bun install`;

  // Check and create .env.example if it doesn't exist
  const envExamplePath = ".env.example";
  const envExampleFile = Bun.file(envExamplePath);
  if (!(await envExampleFile.exists())) {
    console.log("Creating .env.example...");
    await Bun.write(
      envExampleFile,
      "JUBELIO_EMAIL=\nJUBELIO_PASSWORD=\n"
    );
  }

  // Check and copy .env.example to .env if .env doesn't exist
  const envPath = ".env";
  const envFile = Bun.file(envPath);
  if (!(await envFile.exists())) {
    console.log("Copying .env.example to .env...");
    await $`cp .env.example .env`;
  } else {
    console.log(".env already exists. Skipping copy.");
  }

  // Run build to verify
  console.log("Running build to verify setup...");
  const { exitCode } = await $`bun run build`;

  if (exitCode === 0) {
    console.log("Setup completed successfully and application built without crashing.");
  } else {
    console.error(`Build failed with exit code ${exitCode}.`);
    process.exit(exitCode);
  }
}

main().catch((err) => {
  console.error("An error occurred during setup:", err);
  process.exit(1);
});
