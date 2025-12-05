using InvenTracker.DTOs;

namespace InvenTracker.Repositories
{
    public interface IInventoryRepository
    {
        Task<List<InventoryReadDto>> GetAllAsync();
        Task<InventoryReadDto?> GetByIdAsync(int id);
        Task<InventoryReadDto> CreateAsync(InventoryCreateDto dto);
        Task UpdateAsync(int id, InventoryUpdateDto dto);
        Task DeleteAsync(int id);
        Task<List<InventoryReadDto>> GetLowStockAsync();
    }
}
