type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  return {
    title: `ブログ記事 ${id}`,
    description: `ブログ記事の詳細ページです。記事ID: ${id}`,
  };
}

export default async function page({ params }: Params) {
  const { id } = await params;
  return <div>ブログID: {id}</div>;
}
