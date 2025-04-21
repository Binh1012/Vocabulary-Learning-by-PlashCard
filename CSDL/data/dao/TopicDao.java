import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;
import java.util.List;

@Dao
public interface TopicDao {
    @Insert
    void insert(Topic topic);

    @Query("SELECT * FROM Topic")
    List<Topic> getAllTopics();

    @Query("DELETE FROM Topic WHERE id = :id")
    void deleteTopic(int id);
}
