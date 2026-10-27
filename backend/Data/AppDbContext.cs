using Microsoft.EntityFrameworkCore;
using Taskio_demo.Models;

namespace Taskio_demo.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<TaskCard> TaskCards => Set<TaskCard>();
}