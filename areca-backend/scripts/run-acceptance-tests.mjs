#!/usr/bin/env node
import { spawnSync } from 'node:child_process'

const baseUrl = process.env.API_BASE_URL ?? 'http://127.0.0.1:8787'

const tests = [
  {
    name: 'health',
    description: 'GET /api/health',
    args: ['-sS', `${baseUrl}/api/health`]
  },
  {
    name: 'login',
    description: 'POST /api/login (check Set-Cookie)',
    args: [
      '-i',
      '-sS',
      '-X',
      'POST',
      `${baseUrl}/api/login`,
      '-H',
      'Content-Type: application/json',
      '-d',
      JSON.stringify({ token: 'demo-token' })
    ]
  },
  {
    name: 'detect',
    description: 'POST /api/detect',
    args: [
      '-sS',
      '-X',
      'POST',
      `${baseUrl}/api/detect`,
      '-H',
      'Content-Type: application/json',
      '-d',
      JSON.stringify({
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA',
        metadata: { deviceId: 'simulator', lat: 13.32, lon: 74.74 }
      })
    ]
  },
  {
    name: 'upload',
    description: 'POST /api/upload',
    args: [
      '-sS',
      '-X',
      'POST',
      `${baseUrl}/api/upload`,
      '-H',
      'Content-Type: application/json',
      '-d',
      JSON.stringify({
        filename: 'leaf.png',
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA'
      })
    ]
  }
]

for (const test of tests) {
  console.log(`\n▶ Running ${test.description}`)
  const result = spawnSync('curl', test.args, { encoding: 'utf-8' })
  if (result.error) {
    console.error(`✖ Failed to run curl for ${test.name}:`, result.error.message)
    continue
  }
  process.stdout.write(result.stdout)
  process.stderr.write(result.stderr)
}

console.log('\nAll scripted curl checks completed.')
console.log(`Use "API_BASE_URL=https://your-worker.example.com npm run test:curl" to target production.`)

