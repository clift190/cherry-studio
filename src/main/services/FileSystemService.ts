import { TraceMethod } from '@mcp-trace/trace-core'
import fs from 'fs/promises'

export default class FileService {
  @TraceMethod({ spanName: 'readFile', tag: 'FileService' })
  public static async readFile(_: Electron.IpcMainInvokeEvent, pathOrUrl: string, encoding?: BufferEncoding) {
    const path = pathOrUrl.startsWith('file://') ? new URL(pathOrUrl) : pathOrUrl
    if (encoding) return fs.readFile(path, { encoding })
    return fs.readFile(path)
  }
}
