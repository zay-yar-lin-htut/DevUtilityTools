using API.MODEL.Entities;

namespace API.MODEL;

public class AppDbContext
{
    private static readonly Dictionary<int, User> _users = new();
    private static readonly Dictionary<int, SavedResult> _savedResults = new();
    private static readonly Dictionary<string, RefreshToken> _refreshTokens = new();

    public IQueryable<User> Users => _users.Values.AsQueryable();
    public IQueryable<SavedResult> SavedResults => _savedResults.Select(kvp => kvp.Value).AsQueryable();
    public IQueryable<RefreshToken> RefreshTokens => _refreshTokens.Values.AsQueryable();

    public async Task<User> AddAsync(User user)
    {
        var id = _users.Count > 0 ? _users.Keys.Max() + 1 : 1;
        user.UserId = id;
        user.CreatedAt = DateTime.UtcNow;
        _users[id] = user;
        return await Task.FromResult(user);
    }

    public async Task<SavedResult> AddAsync(SavedResult result)
    {
        var id = _savedResults.Count > 0 ? _savedResults.Keys.Max() + 1 : 1;
        result.Id = id;
        result.CreatedAt = DateTime.UtcNow;
        _savedResults[id] = result;
        return await Task.FromResult(result);
    }

    public async Task<User?> FindUserAsync(int id) => await Task.FromResult(_users.GetValueOrDefault(id));
    public async Task<User?> FindUserByUsernameAsync(string username) => 
        await Task.FromResult(_users.Values.FirstOrDefault(u => u.Username.Equals(username, StringComparison.OrdinalIgnoreCase)));
    public async Task<User?> FindUserByEmailAsync(string email) => 
        await Task.FromResult(_users.Values.FirstOrDefault(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase)));

    public async Task<SavedResult?> FindSavedResultAsync(int id) => await Task.FromResult(_savedResults.GetValueOrDefault(id));
    public async Task<IEnumerable<SavedResult>> GetSavedResultsByUserIdAsync(int userId) => 
        await Task.FromResult(_savedResults.Values.Where(r => r.UserId == userId));

    public async Task SaveChangesAsync() => await Task.CompletedTask;

    public void ClearAll()
    {
        _users.Clear();
        _savedResults.Clear();
        _refreshTokens.Clear();
    }
}
