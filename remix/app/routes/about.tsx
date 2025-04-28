export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="mb-4">
          このページはRemixで作られたサンプルアプリケーションのAboutページです。
        </p>
        <p>
          Remixを使えば、高速で使いやすいウェブアプリケーションを作成できます。
          データのロード、フォーム処理、ページ遷移などが簡単に実装できます。
        </p>
      </div>
    </div>
  );
}