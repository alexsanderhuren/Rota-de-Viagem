import express from "express";

import { getViagens, createViagem, getViagem, deleteViagem, updateViagem, upViagem, downViagem } from "../controllers/viagens.js";

const router = express.Router();

router.get("/viagens", getViagens);
router.post("/viagem", createViagem);
router.get("/viagem/:id", getViagem);
router.delete("/viagem/:id/:ordem", deleteViagem);
router.put("/viagem/:id", updateViagem);
router.get("/upviagem/:id/:ordem", upViagem);
router.get("/downviagem/:id/:ordem", downViagem);

export default router;
