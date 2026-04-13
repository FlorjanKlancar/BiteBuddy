import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	transpilePackages: ["@bitebuddy/shared"],
};

export default nextConfig;
