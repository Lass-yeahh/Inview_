using InvenTracker.DTO;
using InvenTracker.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace InvenTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionService _service;

        public TransactionController(ITransactionService service)
        {
            _service = service;
        }
        [Authorize(Roles = "Admin,staff")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var transactions = await _service.GetAllAsync();
            return Ok(transactions);
        }
        [Authorize(Roles = "Admin,staff")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var dto = await _service.GetByIdAsync(id);
            if (dto == null)
                return NotFound();

            return Ok(dto);
        }
        [Authorize(Roles = "Admin,staff")]
        [HttpPost]
        public async Task<IActionResult> Create(TransactionCreateDto dto)
        {
            var username = User?.FindFirst(ClaimTypes.Name)?.Value ?? "Unknown";

            try
            {
                var created = await _service.CreateAsync(dto, username);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
