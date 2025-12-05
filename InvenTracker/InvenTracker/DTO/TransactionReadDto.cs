namespace InvenTracker.DTO
{
    public class TransactionReadDto
    {
        public int Id { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string? Staff { get; set; }
        public string? Remarks { get; set; }
        public DateTime Date { get; set; }
        public string Category { get; set; } = string.Empty;
    }
}
