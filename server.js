// Postman collection link:
// https://www.postman.com/farahmoustafaebrahim-4267084/farah-moustafa/collection/1ie8br3/assignment-2-users-crud?action=share

const http = require("node:http");
const fs = require("node:fs");

const filePath = "./users.json";

function readUsers() {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users));
}

const server = http.createServer((req, res) => {
  const { method, url } = req;
  const id = Number(url.split("/")[2]);
  res.setHeader("Content-Type", "application/json");

  // add user
  if (method === "POST" && url === "/user") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const newUser = JSON.parse(body);
      const users = readUsers();

      const exists = users.find((u) => u.email === newUser.email);
      if (exists) {
        res.statusCode = 409;
        return res.end(JSON.stringify({ message: "Email already exists." }));
      }

      const newId = users.length ? users[users.length - 1].id + 1 : 1;
      users.push({ id: newId, ...newUser });
      writeUsers(users);
      res.statusCode = 201;
      res.end(JSON.stringify({ message: "User added successfully." }));
    });
  }

  // update user
  else if (method === "PATCH" && url.startsWith("/user/")) {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const data = JSON.parse(body);
      const users = readUsers();
      const user = users.find((u) => u.id === id);

      if (!user) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ message: "User ID not found." }));
      }

      if (data.name) user.name = data.name;
      if (data.age) user.age = data.age;
      if (data.email) user.email = data.email;

      writeUsers(users);
      const fields = Object.keys(data).join(", ");
      res.end(JSON.stringify({ message: `User ${fields} updated successfully.` }));
    });
  }

  // delete user
  else if (method === "DELETE" && url.startsWith("/user/")) {
    const users = readUsers();
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: "User ID not found." }));
    }

    users.splice(index, 1);
    writeUsers(users);
    res.end(JSON.stringify({ message: "User deleted successfully." }));
  }

  // get all users
  else if (method === "GET" && url === "/user") {
    res.end(JSON.stringify(readUsers()));
  }

  // get user by id
  else if (method === "GET" && url.startsWith("/user/")) {
    const user = readUsers().find((u) => u.id === id);

    if (!user) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: "User not found." }));
    }

    res.end(JSON.stringify(user));
  }

  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Not found" }));
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
