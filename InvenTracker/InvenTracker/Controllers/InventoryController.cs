using InvenTracker.DTOs;
using InvenTracker.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InvenTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _service;

        public InventoryController(IInventoryService service)
        {
            _service = service;
        }
        [Authorize(Roles = "Admin,staff")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _service.GetAllAsync();
            return Ok(items);
        }
        [Authorize(Roles = "Admin,staff")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null)
                return NotFound();

            return Ok(item);
        }
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(InventoryCreateDto dto)
        {
            var readDto = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = readDto.Id }, readDto);
        }
        [Authorize(Roles = "Admin,staff")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, InventoryUpdateDto dto)
        {
            if (id != dto.Id)
                return BadRequest();

            try
            {
                await _service.UpdateAsync(dto);
                return NoContent();
            }
            catch (ArgumentException)
            {
                return NotFound();
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _service.DeleteAsync(id);
                return NoContent();
            }
            catch (ArgumentException)
            {
                return NotFound();
            }
        }
        [Authorize(Roles = "Admin,staff")]
        [HttpGet("lowstock")]
        public async Task<IActionResult> GetLowStock()
        {
            var items = await _service.GetLowStockAsync();
            return Ok(items);
        }
    }
}
