import fs from "node:fs"
import path from "node:path"

export default function findFilesMatchingPattern(directory: string, pattern: RegExp): string[] {
  const files = fs.readdirSync(directory)

  return files.reduce<string[]>((fileList, file) => {
    const filePath = path.join(directory, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      fileList.push(...findFilesMatchingPattern(filePath, pattern))
      return fileList
    }

    if (stats.isFile() && pattern.test(file)) {
      fileList.push(filePath)
      return fileList
    }

    return fileList
  }, [])
}
