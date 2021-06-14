const { urlencoded } = require("express");
const express = require("express");
const https = require("https");
const TelegramBot = require("node-telegram-bot-api");

const token = "api token";

const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  console.log(msg);
  //type other code here
  const chatId = msg.chat.id;
  const text = msg.text;
  console.log(chatId + "---" + text);
});

const app = express();

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

pincodeList = [
  691001, 691303, 691502, 691501, 691601, 691020, 691506, 691004, 691002,
  691537, 691020, 691509, 691503, 691505, 691508, 691572,
];

function slotTrack() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  dd = parseInt(dd);
  var hrs = today.getHours();
  var mins = today.getMinutes();
  var secs = today.getSeconds();
  console.log("Time: " + hrs + ":" + mins + ":" + secs);
  for (i = 0; i < 5; i++) {
    date = dd + i + "-" + mm + "-" + yyyy;
    url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=298&date=${date}`;
    https.get(url, (res) => {
      let chunks = [];
      res
        .on("data", (data) => {
          chunks.push(data);
        })
        .on("end", () => {
          let data = Buffer.concat(chunks);
          let details = JSON.parse(data);
          let centres = details.sessions;
          centres.forEach((centre) => {
            if (
              centre.min_age_limit == 40 &&
              centre.available_capacity_dose1 > 0
            ) {
              if (pincodeList.includes(centre.pincode)) {
                msg = centre.name + " -- " + centre.pincode;
                bot.sendMessage(793851464, msg);
              }
            }
          });
        });
    });
  }
}
slotTrack();
setInterval(slotTrack, 240000);

app.listen(8888, () => console.log("server running"));
