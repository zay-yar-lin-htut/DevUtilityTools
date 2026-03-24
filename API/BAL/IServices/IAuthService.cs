using API.MODEL.Entities;

namespace API.BAL.IServices;

public interface IAuthService
{
    Task<(User? user, string? error)> Register(string username, string email, string password);
    Task<(User? user, string? error)> Login(string username, string password);
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    bool ValidateRefreshToken(string refreshToken, int userId);
    void StoreRefreshToken(string refreshToken, int userId);
    void InvalidateRefreshToken(int userId);
}
