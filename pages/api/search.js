import path from 'path'
import { readJSON } from 'fs-extra'
import Fuse from 'fuse.js'

export const runtime = 'edge'

export default async function handler (req, res) {
  const { query = {} } = req
  const { q = '' } = query

  const jsonDirectory = path.join(process.cwd(), 'dist')
  const index = await readJSON(jsonDirectory + '/index.json', 'utf8')

  const fuse = new Fuse(index, {
    keys: ['text'],
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2
  })

  // Return the content of the data file in json format
  res.status(200).json(fuse.search(q).slice(0, 5))
}
