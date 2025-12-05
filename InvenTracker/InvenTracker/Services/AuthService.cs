using InvenTracker.DTO;
using InvenTracker.Models;
using InvenTracker.Repositories;
using System.Threading.Tasks;

namespace InvenTracker.Services
{
    public interface IAuthService
    {
        Task<string?> RegisterAsync(Register dto);
        Task<AuthResponseDto?> LoginAsync(LoginDto dto);
    }
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtService _jwtService;

        public AuthService(IUserRepository userRepository, JwtService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }
        public async Task<string?> RegisterAsync(Register dto)
        {
            var username = dto.Username.Trim();

            if (await _userRepository.UsernameExistsAsync(username))
                return null;

            var user = new User
            {
                Username = username,
                PasswordHash = dto.Password.Trim(),
                Role = dto.Role
            };

            await _userRepository.AddUserAsync(user);
            return "User registered successfully";
        }
        public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
        {
            var username = dto.Username.Trim();
            var password = dto.Password.Trim();

            var user = await _userRepository.GetByUsernameAsync(username);
            if (user == null || user.PasswordHash != password)
                return null;

            var token = _jwtService.GenerateToken(user);

            return new AuthResponseDto
            {
                Username = user.Username,
                Role = user.Role,
                Token = token
            };
        }
    }
}
