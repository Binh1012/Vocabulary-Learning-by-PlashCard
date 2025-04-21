import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity
public class Topic {
    @PrimaryKey(autoGenerate = true)
    public int id;

    public String name;

    public Topic(String name) {
        this.name = name;
    }
}
