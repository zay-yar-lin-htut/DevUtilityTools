namespace API.MODEL.Entities;

public class SavedResult
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public ToolType ToolType { get; set; }
    public string Input { get; set; } = string.Empty;
    public string Output { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
