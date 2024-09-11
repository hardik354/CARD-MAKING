const express = require("express");
const app = express();
const path = require("path");
const userModel = require("./models/user");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/read", async (req, res) => {
  try {
    let users = await userModel.find();
    res.render("read", { users: users });
  } catch (error) {
    res.status(500).send("Error retrieving users");
  }
});

app.get("/edit/:userid", async (req, res) => {
  
  let user = await userModel.findOne({ _id: req.params.userid });
  res.render("edit", { user });
});

app.post("/update/:userid", async (req, res) => {
  let { name, image, email } = req.body;
  let user = await userModel.findOneAndUpdate(
    { _id: req.params.userid },
    { name, image, email },
    { new: true }
  );
  res.redirect("/read");
});

app.get("/delete/:id", async (req, res) => {
  try {
    await userModel.findOneAndDelete({ _id: req.params.id });
    res.redirect("/read");
  } catch (error) {
    res.status(500).send("Error deleting user");
  }
});

app.post("/create", async (req, res) => {
  try {
    let { name, email, image } = req.body;
    await userModel.create({ name, email, image });
    res.redirect("/read");
  } catch (error) {
    res.status(500).send("Error creating user");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
