using InvenTracker.Data;
using InvenTracker.DTOs;
using InvenTracker.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace InvenTracker.Repositories
{
    public class InventoryRepository : IInventoryRepository
    {
        private readonly InviewDbContext _context;

        public InventoryRepository(InviewDbContext context)
        {
            _context = context;
        }

        // Get all inventory items
        public async Task<List<InventoryReadDto>> GetAllAsync()
        {
            return await _context.inventories
                .Select(i => new InventoryReadDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    SKU = i.SKU,
                    Quantity = i.Quantity,
                    MinStock = i.MinStock,
                    Category = i.Category,
                    Price = i.Price
                })
                .ToListAsync();
        }

        // Get inventory item by ID
        public async Task<InventoryReadDto?> GetByIdAsync(int id)
        {
            var item = await _context.inventories.FindAsync(id);
            if (item == null) return null;

            return new InventoryReadDto
            {
                Id = item.Id,
                Name = item.Name,
                SKU = item.SKU,
                Quantity = item.Quantity,
                MinStock = item.MinStock,
                Category = item.Category,
                Price = item.Price
            };
        }

        // Create new inventory item with auto-generated SKU
        public async Task<InventoryReadDto> CreateAsync(InventoryCreateDto dto)
        {
            string sku = dto.SKU;
            if (string.IsNullOrWhiteSpace(sku))
            {
                int maxSkuNumber = 0;
                var existingSkus = await _context.inventories
                    .Where(i => i.SKU.StartsWith("INV"))
                    .Select(i => i.SKU.Substring(3))
                    .ToListAsync();

                foreach (var s in existingSkus)
                {
                    if (int.TryParse(s, out int n))
                    {
                        if (n > maxSkuNumber)
                            maxSkuNumber = n;
                    }
                }

                sku = $"INV{(maxSkuNumber + 1).ToString("D6")}";
            }

            var inventory = new Inventory
            {
                Name = dto.Name,
                SKU = sku,
                Quantity = 0,
                MinStock = dto.MinStock,
                Category = dto.Category,
                Price = dto.Price
            };

            await _context.inventories.AddAsync(inventory);
            await _context.SaveChangesAsync();

            return new InventoryReadDto
            {
                Id = inventory.Id,
                Name = inventory.Name,
                SKU = inventory.SKU,
                Quantity = inventory.Quantity,
                MinStock = inventory.MinStock,
                Category = inventory.Category,
                Price = inventory.Price
            };
        }

        // Update existing inventory item
        public async Task UpdateAsync(int id, InventoryUpdateDto dto)
        {
            var item = await _context.inventories.FindAsync(id);
            if (item == null) return;

            item.Name = dto.Name;
            item.Quantity = dto.Quantity;
            item.MinStock = dto.MinStock;
            item.Category = dto.Category;
            item.Price = dto.Price;

            await _context.SaveChangesAsync();
        }

        // Delete inventory item by ID
        public async Task DeleteAsync(int id)
        {
            var item = await _context.inventories.FindAsync(id);
            if (item == null) return;

            _context.inventories.Remove(item);
            await _context.SaveChangesAsync();
        }

        // Get items with low stock
        public async Task<List<InventoryReadDto>> GetLowStockAsync()
        {
            return await _context.inventories
                .Where(i => i.Quantity <= i.MinStock)
                .Select(i => new InventoryReadDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    SKU = i.SKU,
                    Quantity = i.Quantity,
                    MinStock = i.MinStock,
                    Category = i.Category,
                    Price = i.Price
                })
                .ToListAsync();
        }
    }
}
