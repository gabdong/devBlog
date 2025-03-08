import { GetServerSideProps } from 'next';

import { getAllPostList } from '@apis/posts';

const generateSitemap = (
  posts: PostData[],
) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${posts
    .map(
      (post) => `<url>
      <loc>https://gabdong.com/post/${post.idx}</loc>
      <lastmod>${new Date(String(post.updateDatetime)).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`,
    )
    .join('')}
</urlset>`;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const { postList } = await getAllPostList();

  res.setHeader('Content-Type', 'text/xml');
  console.log(generateSitemap(postList));
  // res.write(generateSitemap(postList));
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return <></>;
}
