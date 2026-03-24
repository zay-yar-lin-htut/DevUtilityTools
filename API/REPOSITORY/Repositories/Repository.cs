using System.Linq.Expressions;
using API.MODEL.Entities;

namespace API.REPOSITORY.Repositories;

public class Repository<T> : IRepository<T> where T : class
{
    protected static readonly Dictionary<int, T> _entities = new();
    protected static int _nextId = 1;
    protected static readonly object _lock = new();

    public Task<T?> GetByIdAsync(int id)
    {
        lock (_lock)
        {
            _entities.TryGetValue(id, out var entity);
            return Task.FromResult(entity);
        }
    }

    public Task<IEnumerable<T>> GetAllAsync()
    {
        lock (_lock)
        {
            var result = _entities.Values.ToList();
            return Task.FromResult<IEnumerable<T>>(result);
        }
    }

    public Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
    {
        lock (_lock)
        {
            var func = predicate.Compile();
            var result = _entities.Values.Where(func).ToList();
            return Task.FromResult<IEnumerable<T>>(result);
        }
    }

    public Task<T> AddAsync(T entity)
    {
        lock (_lock)
        {
            var idProperty = typeof(T).GetProperty("Id") ?? typeof(T).GetProperty($"{typeof(T).Name}Id");
            if (idProperty != null)
            {
                idProperty.SetValue(entity, _nextId++);
            }
            _entities[_nextId - 1] = entity;
        }
        return Task.FromResult(entity);
    }

    public Task UpdateAsync(T entity)
    {
        lock (_lock)
        {
            var idProperty = typeof(T).GetProperty("Id") ?? typeof(T).GetProperty($"{typeof(T).Name}Id");
            if (idProperty != null)
            {
                var id = (int)(idProperty.GetValue(entity) ?? 0);
                if (id > 0)
                {
                    _entities[id] = entity;
                }
            }
        }
        return Task.CompletedTask;
    }

    public Task DeleteAsync(int id)
    {
        lock (_lock)
        {
            _entities.Remove(id);
        }
        return Task.CompletedTask;
    }

    public Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null)
    {
        lock (_lock)
        {
            if (predicate == null)
            {
                return Task.FromResult(_entities.Count);
            }
            var func = predicate.Compile();
            return Task.FromResult(_entities.Values.Count(func));
        }
    }
}
