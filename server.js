import express from "express";
import fetch from "node-fetch";
import HttpsProxyAgent from "https-proxy-agent";

const app = express();

app.get("/api/proxy", async (req, res) => {
  const { get } = req.query;

  if (!get) {
    return res.status(400).send("Missing 'get' parameter");
  }

  let lin2Match = get.match(/-(.*?)-/);
  let lin2 = lin2Match ? lin2Match[1] : "";
  let get2 = get.substring(get.lastIndexOf("/") + 1);

  let get3 = "";
  if (get2 === "index.mpd") {
    get2 =
      "?aws.manifestfilter=audio_codec%3AAACL%3Btrickplay_height%3A1-2&aws.sessionId=";
    if (lin2 === "814bffb9b389f652")
      get3 = "954d20f1-f931-41b2-8ad4-5e393e074e03";
    else if (lin2 === "761f422bb93edb7balag")
      get3 = "8cd64625-6fc9-4749-b273-ffc26ed6f8d0";
    else if (lin2 === "761f422bb93edb7b")
      get3 = "adeb3767-fa5c-49e7-b87d-2ba10eaa5446";
  }

  const targetUrl = `https://${get}${get2}${get3}`;

  // your proxy (use ENV variable for security)
  const proxy = process.env.PROXY_URL;  
  const agent = new HttpsProxyAgent(proxy);

  try {
    const response = await fetch(targetUrl, {
      agent,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
      },
    });

    const buffer = await response.arrayBuffer();
    res.status(response.status).send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).send(err.message || err.toString());
  }
});

// Render will use PORT env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
