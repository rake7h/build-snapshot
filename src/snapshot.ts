import fs from "graceful-fs";
import {
  readFile,
  ensureDirectoryExists,
  exractFileName,
  writeFile,
  getAllFilePaths,
  isFileExist,
} from "./files";
import { printBacktickString, normalizeNewlines } from "./string";
import { jestDiffCheck } from "./diff";

export const SNAP_DIR = "__DIST_SNAP__";
export const SNAP_DIST_EXT = ".snap";

const PACKAGE_DIR = "";
const BUILD_DIR = "/dist";

const BUILD_DIR_PATH = `${PACKAGE_DIR}/${BUILD_DIR}`;
const SNAP_DIR_PATH = `${PACKAGE_DIR}/${SNAP_DIR}`;

export const isBuildSnapPresent = (file: string): boolean => {
  // 1. check if __SNAP_DIST__ dir is exists
  // 2. check if __SNAP_DIST__/file.distsnap.js exist
  //
  const filePath = file + SNAP_DIST_EXT;
  console.log({ filePath });
  if (fs.existsSync(filePath)) {
    return true;
  }
  return false;
};

const getSnapFileNameOfBuildFile = (fileName: string) => {
  return `${fileName}${SNAP_DIST_EXT}`;
};

const snapFilePathGenerate = (
  packagePath: string,
  srcFileName: string
): string => {
  return `${packagePath}/${SNAP_DIR}/${getSnapFileNameOfBuildFile(
    srcFileName
  )}`;
};

const getSnapPathOfBuildFile = (buildFilePath: string): string => {
  const buildFileName = exractFileName(buildFilePath);
  return snapFilePathGenerate(PACKAGE_DIR, buildFileName);
};

export const snapFileTemplate = (name: string, data: string): string => {
  // const fileTemplate =
  //   "exports[" +
  //   printBacktickString(name) +
  //   "] = " +
  //   printBacktickString(normalizeNewlines(data)) +
  //   ";";
  const fileTemplate = printBacktickString(normalizeNewlines(data));
  return fileTemplate;
};

export const generateSnap = (file: string) => {
  // 1. get content of build file
  // 2. create a snap file in SNAP_DIR

  const srcFileName = exractFileName(file);

  const sourceContent = readFile(file);
  const snapFile = snapFilePathGenerate(PACKAGE_DIR, srcFileName);

  ensureDirectoryExists(snapFile);
  const snapData = snapFileTemplate(srcFileName, sourceContent);
  writeFile(snapFile, snapData);
};

export const createNewSnaps = () => {
  const files: Array<string> = [];
  getAllFilePaths(BUILD_DIR_PATH, files);

  files.forEach((f) => {
    generateSnap(f);
  });
};

export const diffSnapAndBuild = (buildFilePath: string) => {
  const snapFilePath = getSnapPathOfBuildFile(buildFilePath);

  if (!isFileExist(snapFilePath)) {
    throw new Error(
      `diffSnapAndBuild error snapFile doesnot exist for build. build:${buildFilePath} snap: ${snapFilePath}`
    );
  }

  const snapData = readFile(snapFilePath);
  const buildData = snapFileTemplate("", readFile(buildFilePath));

  jestDiffCheck({ expected: snapData, received: buildData });
};
