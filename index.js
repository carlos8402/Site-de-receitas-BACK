const express = require("express");
const server = express();
const cors = require("cors");
const fs = require("fs");

server.use(cors());
server.use(express.json());

let recipes = require("./src/data/recipes.json");

// Rota para obter todas as receitas
server.get("/recipes", (req, res) => {
  return res.json({ recipes });
});

// Rota para obter uma receita específica por ID
server.get("/recipes/:id", (req, res) => {
  const { id } = req.params;
  const recipe = recipes.find((r) => r.id === parseInt(id));

  if (!recipe) {
    return res.status(404).send("Recipe not found");
  }

  return res.json(recipe);
});

// Rota para criar uma nova receita
server.post("/recipes", (req, res) => {
  const { title, description, ingredients, preparation, type, photo } =
    req.body;

  console.log("Dados recebidos:", req.body);

  // Verificar se todos os campos obrigatórios foram preenchidos
  if (
    !title ||
    !description ||
    !ingredients ||
    !preparation ||
    !type ||
    !photo
  ) {
    return res.status(400).send("Todos os campos são obrigatórios");
  }

  // Criar a nova receita
  const newRecipe = {
    id: recipes.length + 1,
    title,
    description,
    ingredients,
    preparation,
    type,
    photo,
  };

  // Adicionar a nova receita ao array de receitas
  recipes.push(newRecipe);

  // Salvar a nova receita no arquivo JSON
  fs.writeFile(
    "./src/data/recipes.json",
    JSON.stringify(recipes, null, 2),
    (err) => {
      if (err) {
        return res.status(500).send("Erro ao salvar a receita");
      }

      // Retornar a nova receita criada
      return res.status(201).json(newRecipe);
    }
  );
});

// Iniciar o servidor
server.listen(3000, () => {
  console.log("Servidor está funcionando na porta 3000");
});
