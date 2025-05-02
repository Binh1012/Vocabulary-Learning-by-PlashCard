package com.ck.flashcardapp.Database;

import android.content.Context;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

import com.ck.flashcardapp.Dao.CardDao;
import com.ck.flashcardapp.Dao.DeckDao;
import com.ck.flashcardapp.Entity.Card;
import com.ck.flashcardapp.Entity.Deck;

@Database(entities = {Deck.class, Card.class}, version = 1, exportSchema = false)
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
                            .allowMainThreadQueries() // Tạm thời cho phép truy cập main thread để kiểm tra
                            .build();
                }
            }
        }
        return INSTANCE;
    }
}