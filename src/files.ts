import fs from "graceful-fs";
import path from "path";

export const isFileExist = (file: string): boolean => fs.existsSync(file);
export const exractFileName = (file: string): string => path.basename(file);

export const ensureDirectoryExists = (file: string) => {
  try {
    fs.mkdirSync(path.join(path.dirname(file)), { recursive: true });
  } catch {}
};

export const readFile = (file: string) => {
  if (!isFileExist(file)) {
    console.error(`readFile error file doesnot exist: ${file}`);
    return;
  }

  const source = fs.readFileSync(file, "utf8");
  return source;
};

export const writeFile = (file: string, data: string) => {
  fs.writeFileSync(file, data);
};

const getAllFilePaths = (srcPath: string, files: Array<string>) => {
  // that means srcPath is directory
  if (fs.lstatSync(srcPath).isDirectory()) {
    fs.readdirSync(srcPath).forEach((srcItemPath: string) => {
      getAllFilePaths(srcPath + "/" + srcItemPath, files);
    });
  } else {
    // if srcPath is file, push to files
    files.push(srcPath);
  }
};

export { getAllFilePaths };
