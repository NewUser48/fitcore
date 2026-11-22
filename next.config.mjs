/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "avatars.githubusercontent.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/workouts",
        destination: "/trainer/workouts",
        permanent: false,
      },
      {
        source: "/nutrition",
        destination: "/trainer/diet",
        permanent: false,
      },
      {
        source: "/portal/workouts",
        destination: "/member/workouts",
        permanent: false,
      },
      {
        source: "/portal/nutrition",
        destination: "/member/diet",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
