import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { Configuration, OpenAIApi } from "openai"
import "dotenv/config"
import mongoose from "mongoose"
import User from "./Models/User.js"

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();


const url = "mongodb+srv://melihnode:meliherpek1@cluster0.g1oel.mongodb.net/AnneGPT?authSource=admin&replicaSet=atlas-77ie5j-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 100000000 }));

app.use(cors());

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
},
    (err) => { if (err) { throw err } console.log("Mongoose ile bağlantı kuruldu.") })


app.get("/", (req, res) => {
    console.log(configuration.apiKey)
    res.send("çalışıyor")
})


app.post("/Mail", async (req, res) => {
    const { Mail } = req.body;
    const now = new Date();
    const istanbulOffset = 3 * 60; // İstanbul, UTC+3 olduğu için 3 saat ekliyoruz
    const istanbulTime = new Date(now.getTime() + istanbulOffset * 60 * 1000);
    if (!Mail) {
        res.status(400);
        return res.json({ hata: "Eksik alan bırakmayınız." })
    }
    const user = await User.findOne({ Mail: Mail })
    if (user) {
        res.status(400);
        return res.json({ hata: "Bu E-Mail daha önce kullanılmıştır." })
    }
    User.create({
        Mail,
        Date: istanbulTime
    })
    res.json("okey")

})

app.post("/generate", async (req, res) => {
 const userPrompt = req.body.text;
    console.log(userPrompt)
    const openai = new OpenAIApi(configuration);
    const prompt = "Bir anne olarak tavsiye ver. ";

    const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: prompt
            },
            {
                role: "user",
                content: userPrompt
            }
        ],
        max_tokens:50
        
    });
    const generatedText = response.data.choices[0].message.content;
    // const generatedText = "selam";
    res.json(generatedText)
})

app.listen(5000, () => console.log("5000 portunda çalışıyor"))




// const openai = require("openai");

// openai.apiKey = "YOUR_API_KEY"; // API anahtarınızı buraya girin

// const prompt = "OpenAI GPT-4 ile ilgili bilgi verin.";

// async function generateText(prompt) {
//     try {
//         const response = await openai.Completion.create({
//             engine: "text-davinci-002", // GPT-4'ün varsayılan motorunu kullanmak için bu değeri değiştirin.
//             prompt: prompt,
//             max_tokens: 100,
//             n: 1,
//             stop: null,
//             temperature: 0.8,
//         });

//         const generatedText = response.choices[0].text.trim();
//         console.log(generatedText);
//     } catch (error) {
//         console.error("API isteği sırasında hata meydana geldi:", error);
//     }
// }

// generateText(prompt);
