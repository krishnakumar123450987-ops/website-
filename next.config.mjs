/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure proper routing for Netlify
  trailingSlash: false,
  // Output configuration for Netlify
  output: 'export',
  distDir: 'out',
  // Handle dynamic routes
  async redirects() {
    return [
      {
        source: '/reddit%20Automation',
        destination: '/reddit-automation',
        permanent: true,
      },
      {
        source: '/reddit Automation',
        destination: '/reddit-automation',
        permanent: true,
      },
      {
        source: '/appreddit-automation',
        destination: '/reddit-automation',
        permanent: true,
      },
      {
        source: '/app/reddit-automation',
        destination: '/reddit-automation',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
