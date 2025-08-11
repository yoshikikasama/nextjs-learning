import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ブログ記事一覧",
  description: "ブログ記事の一覧を表示します。",
};

// ダミーデータ
const articvles = [
  { id: 1, title: "記事1" },
  { id: 2, title: "記事2" },
  { id: 3, title: "記事3" },
];

// 3秒待機
async function fetchArticles() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  //   throw new Error("ダミーエラー"); // エラーを発生させる
  return articvles;
}

export default async function blogPage() {
  const articles = await fetchArticles();
  return (
    <div>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>title: {article.title}</li>
        ))}
      </ul>
    </div>
  );
}
