import { AuthService } from "../auth.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../prisma/client", () => ({
  prisma: {
    employee: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  let authService: AuthService;
  let mockPrisma: any;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
    mockPrisma = require("../prisma/client").prisma;
  });

  describe("register", () => {
    it("Deve registrar um novo usuário com sucesso", async () => {
      const mockEmployee = {
        id: "test-id",
        name: "João Silva",
        email: "joao@test.com",
        password: "hashed-password",
        role: "user",
      };

      mockPrisma.employee.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
      (jwt.sign as jest.Mock).mockReturnValue("mock-token");
      mockPrisma.employee.create.mockResolvedValue(mockEmployee);

      const result = await authService.register(
        "João Silva",
        "joao@test.com",
        "password123"
      );

      expect(result.employee.name).toBe("João Silva");
      expect(result.token).toBe("mock-token");
      expect(mockPrisma.employee.create).toHaveBeenCalled();
    });

    it("Deve lançar erro se e-mail já existe", async () => {
      const existingEmployee = {
        id: "existing-id",
        email: "joao@test.com",
      };

      mockPrisma.employee.findUnique.mockResolvedValue(existingEmployee);

      await expect(
        authService.register("João Silva", "joao@test.com", "password123")
      ).rejects.toThrow("Este e-mail já está registrado.");
    });
  });

  describe("login", () => {
    it("Deve fazer login com sucesso com credenciais válidas", async () => {
      const mockEmployee = {
        id: "test-id",
        name: "João Silva",
        email: "joao@test.com",
        password: "hashed-password",
        role: "user",
      };

      mockPrisma.employee.findUnique.mockResolvedValue(mockEmployee);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mock-token");

      const result = await authService.login("joao@test.com", "password123");

      expect(result.employee.email).toBe("joao@test.com");
      expect(result.token).toBe("mock-token");
    });

    it("Deve lançar erro se e-mail não existe", async () => {
      mockPrisma.employee.findUnique.mockResolvedValue(null);

      await expect(
        authService.login("nonexistent@test.com", "password123")
      ).rejects.toThrow("E-mail ou senha inválidos.");
    });

    it("Deve lançar erro se senha está incorreta", async () => {
      const mockEmployee = {
        id: "test-id",
        email: "joao@test.com",
        password: "hashed-password",
      };

      mockPrisma.employee.findUnique.mockResolvedValue(mockEmployee);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login("joao@test.com", "wrong-password")
      ).rejects.toThrow("E-mail ou senha inválidos.");
    });
  });

  describe("verifyToken", () => {
    it("Deve verificar token válido", () => {
      (jwt.verify as jest.Mock).mockReturnValue({ id: "test-id" });

      const result = authService.verifyToken("valid-token");

      expect(result).toEqual({ id: "test-id" });
    });

    it("Deve retornar null para token inválido", () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const result = authService.verifyToken("invalid-token");

      expect(result).toBeNull();
    });
  });
});
