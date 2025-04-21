import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;
import java.util.List;

@Dao
public interface FlashCardDao {
    @Insert
    void insert(FlashCard card);

    @Update
    void update(FlashCard card);

    @Query("SELECT * FROM FlashCard WHERE topicId = :topicId")
    List<FlashCard> getCardsForTopic(int topicId);

    @Query("DELETE FROM FlashCard WHERE id = :id")
    void deleteCard(int id);
}
