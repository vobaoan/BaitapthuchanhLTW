using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Taskio_demo.Data;
using Taskio_demo.Models;

namespace Taskio_demo.Controllers;

[ApiController]
[Route("api/taskcards")]
public class TaskCardsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TaskCardsController(AppDbContext context)
    {
        _context = context;
    }

    // GET /api/taskcards
    [HttpGet]
    public async Task<ActionResult<List<TaskCard>>> GetAll()
    {
        var tasks = await _context.TaskCards
            .AsNoTracking()
            .OrderBy(t => t.Id)
            .ToListAsync();

        return Ok(tasks);
    }

    // GET /api/taskcards/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<TaskCard>> GetById(int id)
    {
        var task = await _context.TaskCards.FindAsync(id);

        if (task == null)
        {
            return NotFound();
        }

        return Ok(task);
    }

    // POST /api/taskcards
    [HttpPost]
    public async Task<ActionResult<TaskCard>> Create(
        [FromBody] TaskCard input)
    {
        if (string.IsNullOrWhiteSpace(input.Title))
        {
            return BadRequest("Tên công việc không được để trống.");
        }

        if (!IsValidStatus(input.Status))
        {
            return BadRequest("Trạng thái phải là Todo, Doing hoặc Done.");
        }

        var task = new TaskCard
        {
            Title = input.Title.Trim(),
            Description = input.Description,
            Status = input.Status
        };

        _context.TaskCards.Add(task);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = task.Id },
            task
        );
    }

    // PUT /api/taskcards/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] TaskCard input)
    {
        var task = await _context.TaskCards.FindAsync(id);

        if (task == null)
        {
            return NotFound();
        }

        if (string.IsNullOrWhiteSpace(input.Title))
        {
            return BadRequest("Tên công việc không được để trống.");
        }

        if (!IsValidStatus(input.Status))
        {
            return BadRequest("Trạng thái phải là Todo, Doing hoặc Done.");
        }

        task.Title = input.Title.Trim();
        task.Description = input.Description;
        task.Status = input.Status;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE /api/taskcards/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var task = await _context.TaskCards.FindAsync(id);

        if (task == null)
        {
            return NotFound();
        }

        _context.TaskCards.Remove(task);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static bool IsValidStatus(string status)
    {
        return status is "Todo" or "Doing" or "Done";
    }
}