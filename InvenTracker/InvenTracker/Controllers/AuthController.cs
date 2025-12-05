using InvenTracker.DTO;
using InvenTracker.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace InvenTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(Register dto)
        {
            var result = await _authService.RegisterAsync(dto);

            if (result == null)
                return BadRequest("Username already exists");

            return Ok(result);
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var auth = await _authService.LoginAsync(dto);

            if (auth == null)
                return Unauthorized("Invalid credentials");

            return Ok(auth);
        }
    }
}
