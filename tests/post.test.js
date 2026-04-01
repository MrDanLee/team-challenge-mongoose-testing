const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Post = require("../src/models/Post");

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Conectar mongoose a la BD en memoria antes de importar la app
  process.env.NODE_ENV = "test";
  await mongoose.connect(uri);

  // Importar app después de configurar el entorno
  app = require("../src/index");
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  // Limpiar la colección entre tests
  await Post.deleteMany({});
});

describe("POST /api/post/create", () => {
  test("should create a new post", async () => {
    const post = { title: "new title", body: "new content" };

    let postCount = await Post.countDocuments({});
    expect(postCount).toBe(0);

    const res = await request(app).post("/api/post/create").send(post);

    expect(res.status).toBe(200);
    postCount = await Post.countDocuments({});
    expect(postCount).toBe(1);
    expect(res.body._id).toBeDefined();
    expect(res.body.title).toBe("new title");
    expect(res.body.body).toBe("new content");
    expect(res.body.createdAt).toBeDefined();
    expect(res.body.updatedAt).toBeDefined();
  });
});

describe("GET /api/post", () => {
  test("should return all posts", async () => {
    await Post.create({ title: "Post 1", body: "Body 1" });
    await Post.create({ title: "Post 2", body: "Body 2" });

    const res = await request(app).get("/api/post");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].title).toBe("Post 1");
    expect(res.body[1].title).toBe("Post 2");
  });

  test("should return empty array when no posts exist", async () => {
    const res = await request(app).get("/api/post");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

describe("GET /api/post/id/:_id", () => {
  test("should return a post by id", async () => {
    const post = await Post.create({ title: "Find me", body: "By ID" });

    const res = await request(app).get(`/api/post/id/${post._id}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Find me");
    expect(res.body.body).toBe("By ID");
  });
});

describe("GET /api/post/title/:title", () => {
  test("should return a post by title", async () => {
    await Post.create({ title: "Unique Title", body: "Some body" });

    const res = await request(app).get("/api/post/title/Unique Title");

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Unique Title");
    expect(res.body.body).toBe("Some body");
  });
});

describe("GET /api/post/postsWithPagination", () => {
  beforeEach(async () => {
    // Crear 15 posts para probar paginación
    const posts = [];
    for (let i = 1; i <= 15; i++) {
      posts.push({ title: `Post ${i}`, body: `Body ${i}` });
    }
    await Post.insertMany(posts);
  });

  test("should return first 10 posts on page 1", async () => {
    const res = await request(app).get("/api/post/postsWithPagination?page=1");

    expect(res.status).toBe(200);
    expect(res.body.posts).toHaveLength(10);
    expect(res.body.page).toBe(1);
    expect(res.body.totalPages).toBe(2);
    expect(res.body.total).toBe(15);
  });

  test("should return remaining 5 posts on page 2", async () => {
    const res = await request(app).get("/api/post/postsWithPagination?page=2");

    expect(res.status).toBe(200);
    expect(res.body.posts).toHaveLength(5);
    expect(res.body.page).toBe(2);
    expect(res.body.totalPages).toBe(2);
  });

  test("should default to page 1 when no page param", async () => {
    const res = await request(app).get("/api/post/postsWithPagination");

    expect(res.status).toBe(200);
    expect(res.body.posts).toHaveLength(10);
    expect(res.body.page).toBe(1);
  });

  test("should return empty array for page beyond total", async () => {
    const res = await request(app).get("/api/post/postsWithPagination?page=5");

    expect(res.status).toBe(200);
    expect(res.body.posts).toHaveLength(0);
    expect(res.body.page).toBe(5);
  });
});

describe("PUT /api/post/id/:_id", () => {
  test("should update a post by id", async () => {
    const post = await Post.create({ title: "Old title", body: "Old body" });

    const res = await request(app)
      .put(`/api/post/id/${post._id}`)
      .send({ title: "Updated title", body: "Updated body" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated title");
    expect(res.body.body).toBe("Updated body");

    // Verificar que se guardó en la BD
    const updated = await Post.findById(post._id);
    expect(updated.title).toBe("Updated title");
    expect(updated.body).toBe("Updated body");
  });
});

describe("DELETE /api/post/id/:_id", () => {
  test("should delete a post by id", async () => {
    const post = await Post.create({ title: "Delete me", body: "Bye" });

    const res = await request(app).delete(`/api/post/id/${post._id}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(post._id.toString());

    const postCount = await Post.countDocuments({});
    expect(postCount).toBe(0);
  });
});
