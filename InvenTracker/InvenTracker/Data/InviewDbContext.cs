using InvenTracker.Models;
using Microsoft.EntityFrameworkCore;
namespace InvenTracker.Data
{
    public class InviewDbContext:DbContext
    {
        public InviewDbContext(DbContextOptions<InviewDbContext> options) : base(options) { }
        public DbSet<Inventory> inventories { get; set; }
        public DbSet<Transaction> transactions { get; set; }
        public DbSet<User> users { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Inventory>().HasIndex(i => i.SKU).IsUnique();
            modelBuilder.Entity<Transaction>().HasOne(t => t.Inventory).WithMany(i => i.Transactions).HasForeignKey(t => t.InventoryId);
            base.OnModelCreating(modelBuilder);
        }

    }
}
