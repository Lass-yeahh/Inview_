namespace InvenTracker.DTOs
{
    public class InventoryReadDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SKU { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public int MinStock { get; set; }
        public string? Category { get; set; }
        public decimal Price { get; set; }
    }
}
