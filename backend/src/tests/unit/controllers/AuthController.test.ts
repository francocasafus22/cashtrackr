import { createRequest, createResponse } from "node-mocks-http";
import User from "../../../models/User";
import { AuthController } from "../../../controllers/AuthController";
import { users } from "../../mocks/users";
import { checkPassword, hashPassword } from "../../../utils/auth";
import { generateToken } from "../../../utils/token";
import { AuthEmail } from "../../../emails/AuthEmail";
import { token } from "morgan";
import { generateJWT } from "../../../utils/jwt";

jest.mock("../../../models/User");
jest.mock("../../../utils/auth");
jest.mock("../../../utils/token");
jest.mock("../../../utils/jwt");

describe("AuthController - CreateAccount", () => {
  beforeEach(() => {
    (User.findOne as jest.Mock).mockImplementation((options) => {
      const user =
        users.filter((u) => u.email == options.where.email)[0] ?? null;

      return Promise.resolve(user);
    });
  });

  it("should return a 409 status and a error message if the email is already registered", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/create-account",
      body: {
        email: "franco@gmail.com",
        password: "franco",
      },
    });
    const res = createResponse();

    await AuthController.createAccount(req, res);

    expect(res.statusCode).toBe(409);
    expect(res._getJSONData()).toHaveProperty(
      "error",
      "El email ya está registrado"
    );
    expect(User.findOne).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledTimes(1);
  });

  it("should register a new user and return a success message", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/create-account",
      body: {
        email: "newUser@gmail.com",
        password: "userpassword",
        name: "user",
      },
    });
    const res = createResponse();

    const token = "123456";

    const mockUser = { ...req.body, save: jest.fn() };

    (User.create as jest.Mock).mockResolvedValue(mockUser);
    (hashPassword as jest.Mock).mockResolvedValue("hashedPassword");
    (generateToken as jest.Mock).mockReturnValue(token);

    jest
      .spyOn(AuthEmail, "sendConfirmationEmail")
      .mockImplementation(() => Promise.resolve());

    await AuthController.createAccount(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toHaveProperty(
      "message",
      "Cuenta creada correctamente"
    );
    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(User.create).toHaveBeenCalledTimes(1);
    expect(User.findOne).toHaveBeenCalled();
    expect(mockUser.save).toHaveBeenCalled();
    expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
      name: req.body.name,
      email: req.body.email,
      token: token,
    });
    expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1);
    expect(hashPassword).toHaveBeenCalledWith(req.body.password);
    expect(mockUser.password).toBe("hashedPassword");
    expect(mockUser.token).toBe(token);
  });
});

describe("AuthController - login", () => {
  beforeEach(() => {
    (User.findOne as jest.Mock).mockImplementation((options) => {
      const user =
        users.filter((u) => u.email == options.where.email)[0] ?? null;

      return Promise.resolve(user);
    });
  });

  it("should return 404 status and error message if user not exist", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "newUser@gmail.com",
        password: "newpassword",
      },
    });
    const res = createResponse();

    await AuthController.login(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toHaveProperty("error", "Usuario no encontrado");
  });

  it("should return 403 status and error message if the account has not been confirmed", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: users[0].email,
        password: users[0].password,
      },
    });
    const res = createResponse();

    await AuthController.login(req, res);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toHaveProperty(
      "error",
      "La cuenta no ha sido confirmada"
    );
  });

  it("should return 401 status and error message if the password is incorrect", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: users[1].email,
        password: "contraseñaincorrecta",
      },
    });
    const res = createResponse();

    (checkPassword as jest.Mock).mockResolvedValue(false);

    await AuthController.login(req, res);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toHaveProperty("error", "Contraseña incorrecta");
    expect(checkPassword).toHaveBeenCalledWith(
      req.body.password,
      users[1].password
    );
  });

  it("should return a token if the login is successful", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: users[1].email,
        password: users[1].password,
      },
    });
    const res = createResponse();

    const jwtToken = "123123";

    (checkPassword as jest.Mock).mockResolvedValue(true);
    (generateJWT as jest.Mock).mockReturnValue(jwtToken);

    await AuthController.login(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ token: jwtToken });
    expect(checkPassword).toHaveBeenCalledWith(
      req.body.password,
      users[1].password
    );
    expect(generateJWT).toHaveBeenCalled();
    expect(generateJWT).toHaveBeenCalledWith(users[1].id);
  });
});
