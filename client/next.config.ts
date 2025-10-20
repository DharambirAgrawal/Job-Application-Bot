/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? "https://ubiquitous-fishstick-p59p7wgq9w4c69pj-8000.app.github.dev/api/:path*"
            : '/api/',
      },
    ]
  },
}

module.exports = nextConfig