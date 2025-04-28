export default function Index() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Remixへようこそ！</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        <p className="text-lg mb-4">
          これはRemixで作成された新しいアプリケーションです。
        </p>
        <p className="mb-6">
          Remixは高速で柔軟なReactフレームワークです。ここから始めて素晴らしいアプリを作りましょう！
        </p>
        
        <div className="flex justify-center">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
            始めましょう
          </button>
        </div>
      </div>
    </div>
  );
}