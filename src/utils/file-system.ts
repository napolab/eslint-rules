import { existsSync } from "node:fs";
import { join, dirname } from "node:path";

/**
 * Check if a file exists in the same directory as the given file
 */
export const fileExistsInSameDirectory = (filepath: string, targetFile: string): boolean => {
	const directory = dirname(filepath);
	const targetPath = join(directory, targetFile);

	return existsSync(targetPath);
};

/**
 * Check if a style file exists in the same directory as the given file
 */
export const checkStyleFileExists = (filepath: string, styleFileExtension: string): boolean => {
	return fileExistsInSameDirectory(filepath, styleFileExtension);
};
