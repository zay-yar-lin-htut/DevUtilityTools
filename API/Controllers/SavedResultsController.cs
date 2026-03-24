using API.MODEL.DTOs;
using API.MODEL.Entities;
using API.REPOSITORY;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/saved")]
[Authorize]
[EnableCors("AllowAll")]
public class SavedResultsController : ControllerBase
{
    private readonly ISavedResultRepository _savedResultRepository;

    public SavedResultsController(ISavedResultRepository savedResultRepository)
    {
        _savedResultRepository = savedResultRepository;
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value 
                          ?? User.FindFirst("sub")?.Value;
        
        if (int.TryParse(userIdClaim, out var userId))
        {
            return userId;
        }
        return null;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Authentication required" });
        }

        var results = await _savedResultRepository.GetByUserId(userId.Value);
        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Authentication required" });
        }

        var result = await _savedResultRepository.GetById(id);
        if (result == null)
        {
            return NotFound(new { message = "Saved result not found" });
        }

        if (result.UserId != userId.Value)
        {
            return Unauthorized(new { message = "You do not have permission to view this" });
        }

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] SavedResultRequest request)
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Authentication required" });
        }

        if (string.IsNullOrWhiteSpace(request.Input))
        {
            return BadRequest(new { message = "Input cannot be empty" });
        }

        var savedResult = new SavedResult
        {
            UserId = userId.Value,
            ToolType = (ToolType)request.ToolType,
            Input = request.Input,
            Output = request.Output ?? string.Empty
        };

        var created = await _savedResultRepository.Create(savedResult);

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] SavedResultRequest request)
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Authentication required" });
        }

        var existing = await _savedResultRepository.GetById(id);
        if (existing == null)
        {
            return NotFound(new { message = "Saved result not found" });
        }

        if (existing.UserId != userId.Value)
        {
            return Unauthorized(new { message = "You do not have permission to modify this" });
        }

        if (string.IsNullOrWhiteSpace(request.Input))
        {
            return BadRequest(new { message = "Input cannot be empty" });
        }

        existing.ToolType = (ToolType)request.ToolType;
        existing.Input = request.Input;
        existing.Output = request.Output ?? string.Empty;

        await _savedResultRepository.Update(existing);

        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Authentication required" });
        }

        var existing = await _savedResultRepository.GetById(id);
        if (existing == null)
        {
            return NotFound(new { message = "Saved result not found" });
        }

        if (existing.UserId != userId.Value)
        {
            return Unauthorized(new { message = "You do not have permission to delete this" });
        }

        await _savedResultRepository.Delete(id);

        return Ok(new { message = "Deleted successfully" });
    }
}
