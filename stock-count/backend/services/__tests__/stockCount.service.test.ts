import { StockCountService } from "../stockCount.service";
import { StockCountRepository } from "../../repositories/stockCount.repository";
import { StockCountItemRepository } from "../../repositories/stockCountItem.repository";

jest.mock("../../repositories/stockCount.repository");
jest.mock("../../repositories/stockCountItem.repository");

describe("StockCountService", () => {
  let service: StockCountService;
  let mockStockCountRepo: jest.Mocked<StockCountRepository>;
  let mockItemRepo: jest.Mocked<StockCountItemRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStockCountRepo = new StockCountRepository() as jest.Mocked<StockCountRepository>;
    mockItemRepo = new StockCountItemRepository() as jest.Mocked<StockCountItemRepository>;
    service = new StockCountService(mockStockCountRepo, mockItemRepo);
  });

  describe("getAll", () => {
    it("Deve retornar lista de contagens de estoque", async () => {
      const mockStockCounts = [
        {
          id: "1",
          code: "1071",
          scheduledAt: new Date(),
          status: "EM_ANDAMENTO",
          employee: { id: "e1", name: "João" },
          _count: { items: 5 },
        },
      ];

      mockStockCountRepo.findAll = jest.fn().mockResolvedValue(mockStockCounts);

      const result = await service.getAll();

      expect(result).toHaveLength(1);
      expect(result[0].code).toBe("1071");
      expect(mockStockCountRepo.findAll).toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("Deve retornar uma contagem de estoque por ID", async () => {
      const mockStockCount = {
        id: "1",
        code: "1071",
        scheduledAt: new Date(),
        status: "EM_ANDAMENTO",
        employee: { id: "e1", name: "João", email: "joao@test.com" },
        items: [],
        _count: { items: 0 },
      };

      mockStockCountRepo.findById = jest.fn().mockResolvedValue(mockStockCount);

      const result = await service.getById("1");

      expect(result.code).toBe("1071");
      expect(result.status).toBe("EM_ANDAMENTO");
    });

    it("Deve lançar erro se contagem não encontrada", async () => {
      mockStockCountRepo.findById = jest.fn().mockResolvedValue(null);

      await expect(service.getById("nonexistent")).rejects.toThrow(
        "Contagem de estoque não encontrada."
      );
    });
  });
});
