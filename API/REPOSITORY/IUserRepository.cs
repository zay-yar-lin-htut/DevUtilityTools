using API.MODEL.Entities;

namespace API.REPOSITORY;

public interface IUserRepository
{
    Task<User?> GetById(int userId);
    Task<User?> GetByUsername(string username);
    Task<User?> GetByEmail(string email);
    Task<User> Create(User user);
    Task<User> Update(User user);
}
