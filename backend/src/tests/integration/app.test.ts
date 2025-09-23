import request from "supertest";
import server, { connectDB } from "../../server";
import { AuthEmail } from "../../emails/AuthEmail";
import { AuthController } from "../../controllers/AuthController";
import User from "../../models/User";
import { checkPassword } from "../../utils/auth";
import * as auth from "../../utils/auth";
import * as jwt from "../../utils/jwt";

jest.mock("../../emails/AuthEmail", () => ({
  AuthEmail: {
    sendConfirmationEmail: jest.fn().mockResolvedValue(true),
    sendPasswordResetToken: jest.fn().mockResolvedValue(true),
  },
}));

describe("Authentication - Create Account", () => {
  it("should display validations errores when form is empty", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({});

    const createAccountMock = jest.spyOn(AuthController, "createAccount");

    expect(response.statusCode).toBe(400);
    expect(response.statusCode).not.toBe(200);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(3);
    expect(createAccountMock).not.toHaveBeenCalled();
  });

  it("should return 400 when the email is invalid", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({ name: "franco", password: "franco1234", email: "not-valid" });

    const createAccountMock = jest.spyOn(AuthController, "createAccount");

    expect(response.statusCode).toBe(400);
    expect(response.statusCode).not.toBe(200);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].path).toBe("email");
    expect(response.body.errors[0].msg).toBe("Email no válido");
    expect(createAccountMock).not.toHaveBeenCalled();
  });

  it("should return 400 when the password is less than 8 characters", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({ name: "franco", password: "1234", email: "email@email.com" });

    const createAccountMock = jest.spyOn(AuthController, "createAccount");

    expect(response.statusCode).toBe(400);
    expect(response.statusCode).not.toBe(200);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].path).toBe("password");
    expect(response.body.errors[0].msg).toBe(
      "El password es muy corto, mínimo 8 caracteres."
    );
    expect(createAccountMock).not.toHaveBeenCalled();
  });

  it("should return 201 when a user is created successfully", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({
        name: "usuario",
        password: "usuario123",
        email: "usuario@gmail.com",
      });

    expect(response.statusCode).toBe(201);
    expect(response.statusCode).not.toBe(400);
    expect(response.body.message).toBe("Cuenta creada correctamente");
  });

  it("should return 409 conflict when a user is already registered", async () => {
    const response = await request(server)
      .post("/api/auth/create-account")
      .send({
        name: "usuario",
        password: "usuario123",
        email: "usuario@gmail.com",
      });

    expect(response.statusCode).toBe(409);
    expect(response.statusCode).not.toBe(400);
    expect(response.statusCode).not.toBe(201);
    expect(response.body).not.toHaveProperty("errors");
    expect(response.body.error).toBe("El email ya está registrado");
  });
});

describe("Authentication - Confirm Account with Token", () => {
  it("should display error if token is empty or token is not valid", async () => {
    const response = await request(server)
      .post("/api/auth/confirm-account")
      .send({
        token: "not_valid",
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Token no válido");
  });

  it("should display error if token is empty or token is not valid", async () => {
    const response = await request(server)
      .post("/api/auth/confirm-account")
      .send({
        token: "123123",
      });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Token no válido");
    expect(response.status).not.toBe(200);
  });

  it("should confirm account with a valid token", async () => {
    const token = globalThis.cashTrackrConfirmationToken;
    const response = await request(server)
      .post("/api/auth/confirm-account")
      .send({ token });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Cuenta confirmada correctamente");
    expect(response.status).not.toBe(401);
  });
});

describe(" Authentication - Login", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should display validations errors when the form is empty", async () => {
    const response = await request(server).post("/api/auth/login").send({});

    const loginMock = jest.spyOn(AuthController, "login");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(2);
    expect(response.status).not.toBe(200);
    expect(loginMock).not.toHaveBeenCalled();
  });
  it("should return 400 bad request when the email is invalid", async () => {
    const response = await request(server).post("/api/auth/login").send({
      email: "email_invalid",
      password: "123456789",
    });
    const loginMock = jest.spyOn(AuthController, "login");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Email no válido");
    expect(response.status).not.toBe(200);
    expect(loginMock).not.toHaveBeenCalled();
  });
  it("should return 400 bad request when the password is empty", async () => {
    const response = await request(server).post("/api/auth/login").send({
      email: "usuario@gmail.com",
    });
    const loginMock = jest.spyOn(AuthController, "login");

    expect(loginMock).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("La contraseña es requerida");
    expect(response.status).not.toBe(200);
  });

  it("should return 404 bad request when the user not found", async () => {
    const response = await request(server).post("/api/auth/login").send({
      email: "not_exist_user@gmail.com",
      password: "usuario123",
    });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Usuario no encontrado");
    expect(response.status).not.toBe(200);
  });

  it("should return 403 bad request when the user is not confirmed", async () => {
    (jest.spyOn(User, "findOne") as jest.Mock).mockResolvedValue({
      id: 1,
      confirmed: false,
      password: "hashedPassword",
      email: "user_not_confirmed@test.com",
    });

    const response = await request(server).post("/api/auth/login").send({
      email: "not_exist_user@gmail.com",
      password: "usuario123",
    });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("La cuenta no ha sido confirmada");
    expect(response.status).not.toBe(200);
  });

  it("should return 401 bad request when the password is incorrect", async () => {
    const findOne = (
      jest.spyOn(User, "findOne") as jest.Mock
    ).mockResolvedValue({
      id: 1,
      confirmed: true,
      password: "hash_password",
      email: "usuario@test.com",
    });

    const checkPassword = jest
      .spyOn(auth, "checkPassword")
      .mockResolvedValue(false);

    const response = await request(server).post("/api/auth/login").send({
      email: "usuario@test.com",
      password: "incorrect_password",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Contraseña incorrecta");
    expect(response.status).not.toBe(200);
    expect(findOne).toHaveBeenCalledTimes(1);
    expect(checkPassword).toHaveBeenCalledTimes(1);
  });

  it("should return message when the login is successfully", async () => {
    const findOne = (
      jest.spyOn(User, "findOne") as jest.Mock
    ).mockResolvedValue({
      id: 1,
      confirmed: true,
      password: "hashedPassword",
      email: "usuario@gmail.com",
    });

    const checkPassword = jest
      .spyOn(auth, "checkPassword")
      .mockResolvedValue(true);

    const generateJWT = jest
      .spyOn(jwt, "generateJWT")
      .mockReturnValue("jwt_token");

    const response = await request(server).post("/api/auth/login").send({
      password: "usuario123",
      email: "usuario@gmail.com",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe("jwt_token");
    expect(response.status).not.toBe(409);
    expect(findOne).toHaveBeenCalledTimes(1);
    expect(generateJWT).toHaveBeenCalledTimes(1);
    expect(generateJWT).toHaveBeenCalledWith(1);
    expect(checkPassword).toHaveBeenCalledTimes(1);
    expect(checkPassword).toHaveBeenCalledWith("usuario123", "hashedPassword");
  });
});

let jwt_token: string;

async function authenticateUser() {
  const response = await request(server)
    .post("/api/auth/login")
    .send({ email: "usuario@gmail.com", password: "usuario123" });

  jwt_token = response.body.token;
}

describe("GET /api/budgets", () => {
  beforeAll(() => {
    jest.restoreAllMocks(); // Restaura todas las funciones de los jest.spy a su implementación original
  });
  beforeAll(async () => {
    await authenticateUser();
  });
  it("should reject unautheticated access to budgets without a jwt", async () => {
    const response = await request(server).get("/api/budgets");

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("No estás autorizado");
    expect(response.statusCode).toBe(401);
  });

  it("should reject unautheticated access to budgets with a invalid jwt", async () => {
    const response = await request(server)
      .get("/api/budgets")
      .auth("invalid_jwt", { type: "bearer" });

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Token no válido");
    expect(response.statusCode).toBe(500);
  });

  it("should allow authenticated access to budgets with a valid jwt", async () => {
    const response = await request(server)
      .get("/api/budgets")
      .auth(jwt_token, { type: "bearer" });

    expect(response.body).not.toHaveProperty("error");
    expect(response.body).toHaveLength(0);
    expect(response.statusCode).not.toBe(401);
  });
});

describe("POST /api/budgets", () => {
  beforeAll(async () => {
    await authenticateUser();
  });

  it("should reject unauthenticated post request to budgets without jwt", async () => {
    const response = await request(server).post("/api/budgets");

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("No estás autorizado");
    expect(response.status).toBe(401);
  });
  it("should reject unauthenticated post request to budgets without a valid jwt", async () => {
    const response = await request(server)
      .post("/api/budgets")
      .auth("invalid_token", { type: "bearer" });

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Token no válido");
    expect(response.status).toBe(500);
  });
  it("should display validation when the form is submitted with invalid data", async () => {
    const response = await request(server)
      .post("/api/budgets")
      .auth(jwt_token, { type: "bearer" });

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(4);
    expect(response.statusCode).toBe(400);
  });

  it("should display a message when the form is submitted with valid data", async () => {
    const response = await request(server)
      .post("/api/budgets")
      .auth(jwt_token, { type: "bearer" })
      .send({ name: "vacaciones", amount: 5000 });

    expect(response.body).not.toHaveProperty("errors");
    expect(response.body.message).toBe("Presupuesto creado correctamente");
    expect(response.statusCode).toBe(201);
  });
});

describe(" GET /api/budgets", () => {
  beforeAll(async () => {
    await authenticateUser();
  });

  it("should display a message when get a budget by id", async () => {
    const response = await request(server)
      .get("/api/budgets/1")
      .auth(jwt_token, { type: "bearer" });

    expect(response.body).not.toHaveProperty("error");
    expect(response.body.id).toBe(1);
    expect(response.body.userId).toBe(1);
    expect(response.statusCode).toBe(200);
  });

  it("should reject a error when get a budget by id that not exist", async () => {
    const response = await request(server)
      .get("/api/budgets/2")
      .auth(jwt_token, { type: "bearer" });

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Presupuesto no encontrado");
    expect(response.statusCode).toBe(404);
  });

  it("should reject unauthenticate get request to budget by id without a jwt", async () => {
    const response = await request(server).get("/api/budgets/1");

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("No estás autorizado");
    expect(response.statusCode).toBe(401);
  });

  it("should return 400 bad request when id is not valid", async () => {
    const response = await request(server)
      .get("/api/budgets/not_valid")
      .auth(jwt_token, { type: "bearer" });

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("ID no válido");
    expect(response.statusCode).toBe(400);
  });
});

describe(" PUT /api/budgets", () => {
  
})