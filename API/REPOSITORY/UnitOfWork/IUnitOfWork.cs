using API.MODEL.Entities;

namespace API.REPOSITORY;

public interface IUnitOfWork : IDisposable
{
    IUserRepository Users { get; }
    ISavedResultRepository SavedResults { get; }
    Task<int> SaveChangesAsync();
}
