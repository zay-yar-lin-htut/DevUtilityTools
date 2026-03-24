using API.MODEL.Entities;

namespace API.REPOSITORY.Repositories;

public class UserRepository : IUserRepository
{
    private static readonly Dictionary<int, User> _users = new();
    private static int _nextId = 1;
    private static readonly object _lock = new();

    public Task<User?> GetById(int userId)
    {
        lock (_lock)
        {
            _users.TryGetValue(userId, out var user);
            return Task.FromResult(user);
        }
    }

    public Task<User?> GetByUsername(string username)
    {
        lock (_lock)
        {
            var user = _users.Values.FirstOrDefault(u => u.Username.Equals(username, StringComparison.OrdinalIgnoreCase));
            return Task.FromResult(user);
        }
    }

    public Task<User?> GetByEmail(string email)
    {
        lock (_lock)
        {
            var user = _users.Values.FirstOrDefault(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
            return Task.FromResult(user);
        }
    }

    public Task<User> Create(User user)
    {
        lock (_lock)
        {
            user.UserId = _nextId++;
            user.CreatedAt = DateTime.UtcNow;
            _users[user.UserId] = user;
        }
        return Task.FromResult(user);
    }

    public Task<User> Update(User user)
    {
        lock (_lock)
        {
            if (_users.ContainsKey(user.UserId))
            {
                _users[user.UserId] = user;
            }
        }
        return Task.FromResult(user);
    }
}
