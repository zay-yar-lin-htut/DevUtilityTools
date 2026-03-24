using API.MODEL.Entities;

namespace API.REPOSITORY.Repositories;

public class SavedResultRepository : ISavedResultRepository
{
    private static readonly Dictionary<int, SavedResult> _savedResults = new();
    private static int _nextId = 1;
    private static readonly object _lock = new();

    public Task<SavedResult> Create(SavedResult result)
    {
        lock (_lock)
        {
            result.Id = _nextId++;
            result.CreatedAt = DateTime.UtcNow;
            _savedResults[result.Id] = result;
        }
        return Task.FromResult(result);
    }

    public Task<SavedResult?> GetById(int id)
    {
        lock (_lock)
        {
            _savedResults.TryGetValue(id, out var result);
            return Task.FromResult(result);
        }
    }

    public Task<IEnumerable<SavedResult>> GetByUserId(int userId)
    {
        lock (_lock)
        {
            var results = _savedResults.Values.Where(r => r.UserId == userId).ToList();
            return Task.FromResult<IEnumerable<SavedResult>>(results);
        }
    }

    public Task<SavedResult> Update(SavedResult result)
    {
        lock (_lock)
        {
            if (_savedResults.ContainsKey(result.Id))
            {
                _savedResults[result.Id] = result;
            }
        }
        return Task.FromResult(result);
    }

    public Task Delete(int id)
    {
        lock (_lock)
        {
            _savedResults.Remove(id);
        }
        return Task.CompletedTask;
    }
}
