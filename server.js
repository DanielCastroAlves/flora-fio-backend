require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");
const FormData = require("form-data"); // Importação correta para manipulação do FormData

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() }); // Armazena imagem na memória

app.post("/api/identify", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Nenhuma imagem fornecida" });
        }

        console.log("📸 Recebendo imagem do frontend...");

        // Criando um objeto FormData corretamente
        const formData = new FormData();
        formData.append("images", req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });
        formData.append("organs", "flower"); // Ajuste conforme necessário

        console.log("🌿 Enviando imagem para a API do Pl@ntNet...");

        // Enviando para a API com headers corretos
        const response = await axios.post(
            `https://my-api.plantnet.org/v2/identify/all?api-key=${process.env.PLANTNET_API_KEY}`,
            formData,
            { headers: formData.getHeaders() }
        );

        console.log("✅ Resposta da API do Pl@ntNet:", response.data);

        res.json(response.data);
    } catch (error) {
        console.error("❌ Erro ao chamar a API do Pl@ntNet:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error("Mensagem:", error.message);
        }

        res.status(500).json({ error: "Erro ao processar a requisição", message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
