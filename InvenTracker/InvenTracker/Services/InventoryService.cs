using InvenTracker.DTOs;
using InvenTracker.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InvenTracker.Services
{
    public class InventoryService : IInventoryService
    {
        private readonly IInventoryRepository _repository;

        public InventoryService(IInventoryRepository repository)
        {
            _repository = repository;
        }
        public async Task<List<InventoryReadDto>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }
        public async Task<InventoryReadDto?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }
        public async Task<InventoryReadDto> CreateAsync(InventoryCreateDto dto)
        {
            return await _repository.CreateAsync(dto);
        }
        public async Task UpdateAsync(InventoryUpdateDto dto)
        {
            await _repository.UpdateAsync(dto.Id, dto);
        }
        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
        public async Task<List<InventoryReadDto>> GetLowStockAsync()
        {
            return await _repository.GetLowStockAsync();
        }
    }
}
