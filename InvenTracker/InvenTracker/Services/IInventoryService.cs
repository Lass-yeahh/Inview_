using InvenTracker.DTOs;
using InvenTracker.Models;

namespace InvenTracker.Services
{
    public interface IInventoryService
    {
        Task<List<InventoryReadDto>> GetAllAsync();
        Task<InventoryReadDto?> GetByIdAsync(int id);
        Task<InventoryReadDto> CreateAsync(InventoryCreateDto dto);
        Task UpdateAsync(InventoryUpdateDto dto);
        Task DeleteAsync(int id);
        Task<List<InventoryReadDto>> GetLowStockAsync();
    }
}
