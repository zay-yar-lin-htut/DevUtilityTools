using API.MODEL.Entities;
using API.REPOSITORY;

namespace API.BAL.Services;

public class AuthService : API.BAL.IServices.IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly API.BAL.IServices.IJwtService _jwtService;

    public AuthService(IUserRepository userRepository, API.BAL.IServices.IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<(User? user, string? error)> Register(string username, string email, string password)
    {
        if (string.IsNullOrWhiteSpace(username))
        {
            return (null, "Username is required");
        }

        if (string.IsNullOrWhiteSpace(email))
        {
            return (null, "Email is required");
        }

        if (string.IsNullOrWhiteSpace(password))
        {
            return (null, "Password is required");
        }

        if (password.Length < 6)
        {
            return (null, "Password must be at least 6 characters");
        }

        var existingUser = await _userRepository.GetByUsername(username);
        if (existingUser != null)
        {
            return (null, "Username already exists");
        }

        var existingEmail = await _userRepository.GetByEmail(email);
        if (existingEmail != null)
        {
            return (null, "Email already exists");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

        var user = new User
        {
            Username = username.Trim(),
            Email = email.Trim(),
            PasswordHash = passwordHash
        };

        var createdUser = await _userRepository.Create(user);

        return (createdUser, null);
    }

    public async Task<(User? user, string? error)> Login(string username, string password)
    {
        if (string.IsNullOrWhiteSpace(username))
        {
            return (null, "Username is required");
        }

        if (string.IsNullOrWhiteSpace(password))
        {
            return (null, "Password is required");
        }

        var user = await _userRepository.GetByUsername(username);
        if (user == null)
        {
            return (null, "Invalid username or password");
        }

        if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
        {
            return (null, "Invalid username or password");
        }

        return (user, null);
    }

    public string GenerateAccessToken(User user)
    {
        return _jwtService.GenerateAccessToken(user);
    }

    public string GenerateRefreshToken()
    {
        return _jwtService.GenerateRefreshToken();
    }

    public bool ValidateRefreshToken(string refreshToken, int userId)
    {
        return _jwtService.ValidateRefreshToken(refreshToken, userId);
    }

    public void StoreRefreshToken(string refreshToken, int userId)
    {
        _jwtService.StoreRefreshToken(refreshToken, userId);
    }

    public void InvalidateRefreshToken(int userId)
    {
        _jwtService.InvalidateRefreshToken(userId);
    }
}
