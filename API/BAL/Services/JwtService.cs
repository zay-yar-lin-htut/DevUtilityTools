using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using API.MODEL.ApplicationConfig;
using API.MODEL.Entities;

namespace API.BAL.Services;

public class JwtService : API.BAL.IServices.IJwtService
{
    private readonly JwtSettings _jwtSettings;
    private readonly Dictionary<string, (int UserId, DateTime ExpiresAt)> _refreshTokens = new();
    private readonly object _lock = new();

    public JwtService(JwtSettings jwtSettings)
    {
        _jwtSettings = jwtSettings;
    }

    public string GenerateAccessToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new Claim("username", user.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(_jwtSettings.ExpirationDays),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    public ClaimsPrincipal? ValidateToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_jwtSettings.Key);

        try
        {
            var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _jwtSettings.Issuer,
                ValidateAudience = true,
                ValidAudience = _jwtSettings.Audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return principal;
        }
        catch
        {
            return null;
        }
    }

    public void StoreRefreshToken(string refreshToken, int userId)
    {
        lock (_lock)
        {
            _refreshTokens[refreshToken] = (userId, DateTime.UtcNow.AddDays(_jwtSettings.ExpirationDays * 2));
        }
    }

    public bool ValidateRefreshToken(string refreshToken, int userId)
    {
        lock (_lock)
        {
            if (_refreshTokens.TryGetValue(refreshToken, out var tokenInfo))
            {
                if (tokenInfo.UserId == userId && tokenInfo.ExpiresAt > DateTime.UtcNow)
                {
                    return true;
                }
                _refreshTokens.Remove(refreshToken);
            }
            return false;
        }
    }

    public void InvalidateRefreshToken(int userId)
    {
        lock (_lock)
        {
            var tokensToRemove = _refreshTokens
                .Where(kvp => kvp.Value.UserId == userId)
                .Select(kvp => kvp.Key)
                .ToList();

            foreach (var token in tokensToRemove)
            {
                _refreshTokens.Remove(token);
            }
        }
    }

    public void RemoveRefreshToken(string refreshToken)
    {
        lock (_lock)
        {
            _refreshTokens.Remove(refreshToken);
        }
    }
}
