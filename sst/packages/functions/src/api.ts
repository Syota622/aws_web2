// SST v3での正しいハンドラー（インポート文を全て削除）
export const handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from SST!",
      event: event
    }),
  };
};
