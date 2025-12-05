using InvenTracker.Data;
using InvenTracker.DTO;
using InvenTracker.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InvenTracker.Repositories
{
    // Handles transaction data operations
    public class TransactionRepository : ITransactionRepository
    {
        private readonly InviewDbContext _context;

        public TransactionRepository(InviewDbContext context)
        {
            _context = context;
        }

        // Get all transactions with inventory details
        public async Task<List<TransactionReadDto>> GetAllAsync()
        {
            return await _context.transactions
                .Include(t => t.Inventory)
                .OrderByDescending(t => t.Date)
                .Select(t => new TransactionReadDto
                {
                    Id = t.Id,
                    ProductName = t.Inventory.Name,
                    Category = t.Inventory.Category,
                    Type = t.Type,
                    Quantity = t.Quantity,
                    Staff = t.Staff,
                    Remarks = t.Remarks,
                    Date = t.Date
                })
                .ToListAsync();
        }

        // Get transaction by ID with inventory details
        public async Task<TransactionReadDto?> GetByIdAsync(int id)
        {
            var t = await _context.transactions
                .Include(tr => tr.Inventory)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (t == null) return null;

            return new TransactionReadDto
            {
                Id = t.Id,
                ProductName = t.Inventory.Name,
                Category = t.Inventory.Category,
                Type = t.Type,
                Quantity = t.Quantity,
                Staff = t.Staff,
                Remarks = t.Remarks,
                Date = t.Date
            };
        }

        // Create new transaction and update inventory
        public async Task<TransactionReadDto> CreateAsync(TransactionCreateDto dto, string staffUserName)
        {
            var inventory = await _context.inventories.FindAsync(dto.InventoryId);
            if (inventory == null)
                throw new ArgumentException("Inventory item not found");

            if (dto.Type == "OUT" && inventory.Quantity < dto.Quantity)
                throw new InvalidOperationException("Insufficient stock");

            if (dto.Type == "IN")
                inventory.Quantity += dto.Quantity;
            else
                inventory.Quantity -= dto.Quantity;

            var transaction = new Models.Transaction
            {
                InventoryId = dto.InventoryId,
                Type = dto.Type,
                Quantity = dto.Quantity,
                Staff = staffUserName,
                Remarks = dto.Remarks,
                Date = DateTime.Now
            };

            await _context.transactions.AddAsync(transaction);
            await _context.SaveChangesAsync();

            return new TransactionReadDto
            {
                Id = transaction.Id,
                ProductName = inventory.Name,
                Category = inventory.Category,
                Type = transaction.Type,
                Quantity = transaction.Quantity,
                Staff = transaction.Staff,
                Remarks = transaction.Remarks,
                Date = transaction.Date
            };
        }

        // Delete transaction by ID
        public async Task DeleteAsync(int id)
        {
            var transaction = await _context.transactions.FindAsync(id);
            if (transaction == null)
                return;

            _context.transactions.Remove(transaction);
            await _context.SaveChangesAsync();
        }
    }
}
