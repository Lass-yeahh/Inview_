using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InvenTracker.Models
{
    public class Transaction
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int InventoryId { get; set; }
        [ForeignKey(nameof(InventoryId))]
        public Inventory? Inventory { get; set; }
        [Required, MaxLength(10)]
        public string Type { get; set; } = "IN";
        [Required]
        public int Quantity { get; set; }
        [MaxLength(100)]
        public string? Staff { get; set; }
        [MaxLength(255)]
        public string? Remarks { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
    }
}
