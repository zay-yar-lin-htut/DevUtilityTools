namespace API.MODEL.DTOs;

public record RegisterRequest(string Username, string Email, string Password);
public record LoginRequest(string Username, string Password);
public record RefreshRequest(string RefreshToken);

public class AuthResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public UserResponse User { get; set; } = new();
    public int ExpiresIn { get; set; }
}

public class UserResponse
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
