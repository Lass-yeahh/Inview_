using InvenTracker.Data;
using InvenTracker.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace InvenTracker.Repositories
{
    // Defines methods for user data operations
    public interface IUserRepository
    {
        Task<bool> UsernameExistsAsync(string username);
        Task<User?> GetByUsernameAsync(string username);
        Task AddUserAsync(User user);
    }

    // Handles user data operations in the database
    public class UserRepository : IUserRepository
    {
        private readonly InviewDbContext _context;

        public UserRepository(InviewDbContext context)
        {
            _context = context;
        }

        // Check if a username already exists
        public Task<bool> UsernameExistsAsync(string username)
        {
            return _context.users.AnyAsync(u => u.Username == username);
        }

        // Get user by username
        public Task<User?> GetByUsernameAsync(string username)
        {
            return _context.users.FirstOrDefaultAsync(u => u.Username == username);
        }

        // Add a new user to the database
        public async Task AddUserAsync(User user)
        {
            _context.users.Add(user);
            await _context.SaveChangesAsync();
        }
    }
}
