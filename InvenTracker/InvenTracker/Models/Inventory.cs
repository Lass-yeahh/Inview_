using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InvenTracker.Models
{
    public class Inventory
    {
        [Key]
        public int Id { get; set; }
        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(50)]
        public string SKU { get; set; }
        [Required]
        public int Quantity { get; set; } = 0;
        [Required]
        public int MinStock { get; set; } = 5;
        [MaxLength(50)]
        public string? Category { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        public ICollection<Transaction>? Transactions { get; set; }
    }
}
