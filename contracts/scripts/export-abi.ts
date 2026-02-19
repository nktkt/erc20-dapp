import * as fs from "fs";
import * as path from "path";

async function main() {
  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/MyToken.sol/MyToken.json"
  );
  const destDir = path.join(__dirname, "../../frontend/src/abi");
  const destPath = path.join(destDir, "MyToken.json");

  if (!fs.existsSync(artifactPath)) {
    console.error("Artifact not found. Run `hardhat compile` first.");
    process.exit(1);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  const abi = artifact.abi;

  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(destPath, JSON.stringify(abi, null, 2));
  console.log(`ABI exported to ${destPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
