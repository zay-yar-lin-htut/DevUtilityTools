using System.Security.Claims;
using API.MODEL.Entities;

namespace API.BAL.IServices;

public interface IJwtService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    ClaimsPrincipal? ValidateToken(string token);
    bool ValidateRefreshToken(string refreshToken, int userId);
    void StoreRefreshToken(string refreshToken, int userId);
    void InvalidateRefreshToken(int userId);
    void RemoveRefreshToken(string refreshToken);
}
