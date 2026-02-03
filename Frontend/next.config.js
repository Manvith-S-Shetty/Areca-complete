/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Gracefully handle missing env vars during build
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Areca'
  }
}

module.exports = nextConfig
