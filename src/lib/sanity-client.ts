import { createClient } from 'next-sanity';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-04-01',
  useCdn: process.env.NODE_ENV === 'production',
});

// Helper for fetching Hero Banners
export async function getHeroBanners() {
  return sanityClient.fetch(`*[_type == "heroBanner" && isActive == true] | order(_createdAt desc)`);
}

// Helper for fetching Customer info by email
export async function getCustomerByEmail(email: string) {
  return sanityClient.fetch(`*[_type == "customer" && email == $email][0]`, { email });
}
