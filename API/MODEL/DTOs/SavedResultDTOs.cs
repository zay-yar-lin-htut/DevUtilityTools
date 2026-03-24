namespace API.MODEL.DTOs;

public record SavedResultRequest(int ToolType, string Input, string? Output);
