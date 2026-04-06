import { prisma } from "../prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  employee: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export class AuthService {
  async register(
    name: string,
    email: string,
    password: string,
    role: string = "user"
  ): Promise<LoginResponse> {
    const existingEmployee = await prisma.employee.findUnique({
      where: { email },
    });

    if (existingEmployee) {
      throw new Error("Este e-mail já está registrado.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    const token = this.generateToken(employee.id);

    return {
      token,
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
    };
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const employee = await prisma.employee.findUnique({
      where: { email },
    });

    if (!employee) {
      throw new Error("E-mail ou senha inválidos.");
    }

    const passwordMatch = await bcrypt.compare(password, employee.password);

    if (!passwordMatch) {
      throw new Error("E-mail ou senha inválidos.");
    }

    const token = this.generateToken(employee.id);

    return {
      token,
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
    };
  }

  verifyToken(token: string): { id: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      return decoded;
    } catch {
      return null;
    }
  }

  private generateToken(employeeId: string): string {
    return jwt.sign({ id: employeeId }, JWT_SECRET, { expiresIn: "7d" });
  }
}
