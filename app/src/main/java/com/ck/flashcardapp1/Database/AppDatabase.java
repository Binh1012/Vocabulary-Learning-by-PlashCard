package com.ck.flashcardapp1.Database;

import android.content.Context;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.room.migration.Migration;
import androidx.sqlite.db.SupportSQLiteDatabase;

import com.ck.flashcardapp1.Dao.CardDao;
import com.ck.flashcardapp1.Dao.DeckDao;
import com.ck.flashcardapp1.Entity.Card;
import com.ck.flashcardapp1.Entity.Deck;

@Database(entities = {Deck.class, Card.class}, version = 2, exportSchema = false)
public abstract class AppDatabase extends RoomDatabase {
    public abstract DeckDao deckDao();
    public abstract CardDao cardDao();

    private static volatile AppDatabase INSTANCE;

    public static AppDatabase getInstance(Context context) {
        if (INSTANCE == null) {
            synchronized (AppDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(context.getApplicationContext(),
                                    AppDatabase.class, "FlashCardDB")
                            .addMigrations(MIGRATION_1_2)
                            .build();
                }
            }
        }
        return INSTANCE;
    }

    static final Migration MIGRATION_1_2 = new Migration(1, 2) {
        @Override
        public void migrate(SupportSQLiteDatabase database) {
            database.execSQL("ALTER TABLE deck ADD COLUMN cardCount INTEGER NOT NULL DEFAULT 0");
        }
    };
}