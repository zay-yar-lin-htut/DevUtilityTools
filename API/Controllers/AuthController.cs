using API.BAL.IServices;
using API.BAL.Services;
using API.MODEL.ApplicationConfig;
using API.MODEL.DTOs;
using API.MODEL.Entities;
using API.REPOSITORY;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableCors("AllowAll")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var (user, error) = await _authService.Register(request.Username, request.Email, request.Password);

        if (error != null)
        {
            return BadRequest(new { message = error });
        }

        var accessToken = _authService.GenerateAccessToken(user!);
        var refreshToken = _authService.GenerateRefreshToken();
        _authService.StoreRefreshToken(refreshToken, user!.UserId);

        return Ok(new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            User = new UserResponse
            {
                Id = user.UserId,
                Username = user.Username,
                Email = user.Email
            },
            ExpiresIn = 604800
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var (user, error) = await _authService.Login(request.Username, request.Password);

        if (error != null)
        {
            return Unauthorized(new { message = error });
        }

        var accessToken = _authService.GenerateAccessToken(user!);
        var refreshToken = _authService.GenerateRefreshToken();
        _authService.StoreRefreshToken(refreshToken, user!.UserId);

        return Ok(new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            User = new UserResponse
            {
                Id = user.UserId,
                Username = user.Username,
                Email = user.Email
            },
            ExpiresIn = 604800
        });
    }

    [HttpPost("refresh")]
    public IActionResult Refresh([FromBody] RefreshRequest request)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value 
                          ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "Invalid token" });
        }

        if (!_authService.ValidateRefreshToken(request.RefreshToken, userId))
        {
            return Unauthorized(new { message = "Invalid or expired refresh token" });
        }

        var user = new User
        {
            UserId = userId,
            Username = User.FindFirst("username")?.Value ?? string.Empty,
            Email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value 
                    ?? User.FindFirst("email")?.Value ?? string.Empty
        };

        var accessToken = _authService.GenerateAccessToken(user);
        var newRefreshToken = _authService.GenerateRefreshToken();

        return Ok(new
        {
            AccessToken = accessToken,
            RefreshToken = newRefreshToken,
            ExpiresIn = 604800
        });
    }

    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value 
                          ?? User.FindFirst("sub")?.Value;

        if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out var userId))
        {
            _authService.InvalidateRefreshToken(userId);
        }

        return Ok(new { message = "Logout successful" });
    }
}
