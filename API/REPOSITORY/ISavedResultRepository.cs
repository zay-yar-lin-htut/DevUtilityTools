using API.MODEL.Entities;

namespace API.REPOSITORY;

public interface ISavedResultRepository
{
    Task<SavedResult> Create(SavedResult result);
    Task<SavedResult?> GetById(int id);
    Task<IEnumerable<SavedResult>> GetByUserId(int userId);
    Task<SavedResult> Update(SavedResult result);
    Task Delete(int id);
}
