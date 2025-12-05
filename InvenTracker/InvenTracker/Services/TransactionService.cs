using InvenTracker.DTO;
using InvenTracker.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InvenTracker.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _repository;

        public TransactionService(ITransactionRepository repository)
        {
            _repository = repository;
        }
        public Task<List<TransactionReadDto>> GetAllAsync()
        {
            return _repository.GetAllAsync();
        }
        public Task<TransactionReadDto?> GetByIdAsync(int id)
        {
            return _repository.GetByIdAsync(id);
        }
        public Task<TransactionReadDto> CreateAsync(TransactionCreateDto dto, string staffUserName)
        {
            return _repository.CreateAsync(dto, staffUserName);
        }
        public Task DeleteAsync(int id)
        {
            return _repository.DeleteAsync(id);
        }
    }
}
