package com.ck.flashcardapp1.Dao;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import com.ck.flashcardapp1.Entity.Deck;

import java.util.List;

@Dao
public interface DeckDao {
    @Insert
    long insert(Deck deck);

    @Update
    void update(Deck deck);

    @Query("SELECT * FROM deck")
    List<Deck> getAllDecks();

    @Query("SELECT * FROM deck WHERE name LIKE '%' || :query || '%'")
    List<Deck> searchDecks(String query);

    @Query("DELETE FROM deck WHERE id = :deckId")
    void deleteDeck(long deckId);

    @Query("SELECT COUNT(*) FROM card WHERE deckId = :deckId")
    int getCardCount(long deckId);
}