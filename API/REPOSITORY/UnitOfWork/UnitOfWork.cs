using API.REPOSITORY.Repositories;

namespace API.REPOSITORY.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly Dictionary<Type, object> _repositories = new();

    private IUserRepository? _users;
    private ISavedResultRepository? _savedResults;

    public IUserRepository Users => _users ??= new UserRepository();
    public ISavedResultRepository SavedResults => _savedResults ??= new SavedResultRepository();

    public Task<int> SaveChangesAsync()
    {
        return Task.FromResult(1);
    }

    public void Dispose()
    {
        _users = null;
        _savedResults = null;
        _repositories.Clear();
    }
}
