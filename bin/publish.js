/**
 * @Author: AidenYangX
 * @Email: xscs709560271@gmail.com
 * @Description: 发布脚本
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// 执行命令并打印输出
function exec(command) {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`执行命令失败: ${command}`);
    process.exit(1);
  }
}

// 检查版本号
function checkVersion() {
  const pkgPath = path.join(
    __dirname,
    "..",
    "modules",
    "react-tree-x",
    "package.json",
  );
  const pkg = require(pkgPath);

  if (!pkg.version) {
    throw new Error("package.json 中没有定义版本号");
  }

  console.log(`准备发布版本: ${pkg.version}`);
  return pkg.version;
}

// 主函数
function main() {
  try {
    // 检查版本号
    const version = checkVersion();

    console.log("开始构建...");
    exec("pnpm build");

    console.log("复制 README 文件...");
    const readmePath = path.join(__dirname, "..", "README.md");
    const targetPath = path.join(
      __dirname,
      "..",
      "modules",
      "react-tree-x",
      "README.md",
    );
    fs.copyFileSync(readmePath, targetPath);

    console.log(`发布 v${version}...`);
    const publishArgs = process.argv.slice(2).join(" ");
    exec(`pnpm --filter react-tree-x publish ${publishArgs}`);

    console.log("发布完成！🎉");
  } catch (error) {
    console.error("发布失败:", error.message);
    process.exit(1);
  }
}

main();
