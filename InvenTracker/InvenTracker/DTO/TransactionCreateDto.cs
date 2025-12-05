namespace InvenTracker.DTO
{
    public class TransactionCreateDto
    {
        public int InventoryId { get; set; }
        public string Type { get; set; } = "IN";
        public int Quantity { get; set; }
        //public string? Staff { get; set; }
        public string? Remarks { get; set; }
    }
}
