import androidx.room.Entity;
import androidx.room.ForeignKey;
import androidx.room.PrimaryKey;

import java.util.Date;

@Entity(
    foreignKeys = @ForeignKey(
        entity = Topic.class,
        parentColumns = "id",
        childColumns = "topicId",
        onDelete = ForeignKey.CASCADE
    )
)
public class FlashCard {
    @PrimaryKey(autoGenerate = true)
    public int id;

    public int topicId;

    public String word;
    public String meaning;
    public String note;

    public Date lastViewed;
    public int memorizationLevel; // 1 = chưa thuộc, 2 = nhớ 1 phần, 3 = đã thuộc

    public FlashCard(int topicId, String word, String meaning, String note, Date lastViewed, int memorizationLevel) {
        this.topicId = topicId;
        this.word = word;
        this.meaning = meaning;
        this.note = note;
        this.lastViewed = lastViewed;
        this.memorizationLevel = memorizationLevel;
    }
}
