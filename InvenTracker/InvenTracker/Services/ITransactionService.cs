using InvenTracker.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InvenTracker.Services
{
    public interface ITransactionService
    {
        Task<List<TransactionReadDto>> GetAllAsync();
        Task<TransactionReadDto?> GetByIdAsync(int id);
        Task<TransactionReadDto> CreateAsync(TransactionCreateDto dto, string staffUserName);
        Task DeleteAsync(int id);
    }
}
